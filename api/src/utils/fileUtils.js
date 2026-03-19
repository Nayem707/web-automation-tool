const fs = require("fs").promises;
const path = require("path");
const Logger = require("./logger");

/**
 * Enhanced utility functions for file operations with backup management
 */
class FileUtils {
  /**
   * Check if a file exists
   * @param {string} filePath - Path to the file
   * @returns {Promise<boolean>}
   */
  static async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ensure directory exists, create if not
   * @param {string} dirPath - Directory path
   */
  static async ensureDirectory(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== "EEXIST") {
        throw error;
      }
    }
  }

  /**
   * Read JSON file safely with error recovery
   * @param {string} filePath - Path to JSON file
   * @param {Object} options - Options for reading
   * @returns {Promise<Object|Array>}
   */
  static async readJsonFile(filePath, options = {}) {
    const { fallbackToBackup = true, defaultValue = [] } = options;
    
    try {
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        return defaultValue;
      }
      
      // If JSON is corrupted and fallbackToBackup is enabled
      if (error instanceof SyntaxError && fallbackToBackup) {
        Logger.warn(`Primary file ${filePath} is corrupted, attempting to restore from backup`);
        const backupData = await this.restoreFromBackup(filePath);
        if (backupData) {
          return backupData;
        }
      }
      
      throw error;
    }
  }

  /**
   * Write JSON file safely with atomic writes
   * @param {string} filePath - Path to JSON file
   * @param {Object|Array} data - Data to write
   * @param {Object} options - Write options
   */
  static async writeJsonFile(filePath, data, options = {}) {
    const { 
      backup = true, 
      atomic = true, 
      maxBackups = 10,
      validateJson = true 
    } = options;
    
    const dir = path.dirname(filePath);
    await this.ensureDirectory(dir);

    const jsonString = JSON.stringify(data, null, 2);
    
    // Validate JSON if requested
    if (validateJson) {
      try {
        JSON.parse(jsonString);
      } catch (error) {
        throw new Error(`Invalid JSON data: ${error.message}`);
      }
    }

    // Create backup before writing
    if (backup && await this.fileExists(filePath)) {
      await this.createVersionedBackup(filePath, maxBackups);
    }

    if (atomic) {
      // Write to temporary file first, then rename (atomic operation)
      const tempPath = `${filePath}.tmp.${Date.now()}`;
      try {
        await fs.writeFile(tempPath, jsonString, "utf8");
        await fs.rename(tempPath, filePath);
      } catch (error) {
        // Clean up temp file if rename fails
        await fs.unlink(tempPath).catch(() => {});
        throw error;
      }
    } else {
      await fs.writeFile(filePath, jsonString, "utf8");
    }
  }

  /**
   * Create versioned backup with rotation
   * @param {string} filePath - Path to file to backup
   * @param {number} maxBackups - Maximum number of backups to keep
   * @returns {Promise<string>} - Path to created backup
   */
  static async createVersionedBackup(filePath, maxBackups = 10) {
    if (!(await this.fileExists(filePath))) {
      return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = `${filePath}.backup.${timestamp}`;
    
    try {
      await fs.copyFile(filePath, backupPath);
      
      // Clean up old backups
      await this.cleanupOldBackups(filePath, maxBackups);
      
      Logger.info(`Created backup: ${path.basename(backupPath)}`);
      return backupPath;
    } catch (error) {
      Logger.error(`Failed to create backup: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clean up old backup files, keeping only the most recent
   * @param {string} originalFilePath - Original file path
   * @param {number} maxBackups - Maximum backups to keep
   */
  static async cleanupOldBackups(originalFilePath, maxBackups) {
    try {
      const dir = path.dirname(originalFilePath);
      const baseName = path.basename(originalFilePath);
      const files = await fs.readdir(dir);
      
      // Find all backup files for this file
      const backupPattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.backup\\.`);
      const backupFiles = files
        .filter(file => backupPattern.test(file))
        .map(file => ({
          name: file,
          path: path.join(dir, file),
          mtime: null
        }));
      
      // Get modification times
      for (const backup of backupFiles) {
        try {
          const stats = await fs.stat(backup.path);
          backup.mtime = stats.mtime;
        } catch (error) {
          Logger.warn(`Could not stat backup file ${backup.name}: ${error.message}`);
        }
      }
      
      // Sort by modification time (newest first) and remove old ones
      const validBackups = backupFiles.filter(b => b.mtime);
      validBackups.sort((a, b) => b.mtime - a.mtime);
      
      if (validBackups.length > maxBackups) {
        const toDelete = validBackups.slice(maxBackups);
        for (const backup of toDelete) {
          try {
            await fs.unlink(backup.path);
            Logger.debug(`Deleted old backup: ${backup.name}`);
          } catch (error) {
            Logger.warn(`Failed to delete backup ${backup.name}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      Logger.warn(`Failed to cleanup backups: ${error.message}`);
    }
  }

  /**
   * Restore data from the most recent backup
   * @param {string} filePath - Original file path
   * @returns {Promise<Object|null>} - Restored data or null
   */
  static async restoreFromBackup(filePath) {
    try {
      const dir = path.dirname(filePath);
      const baseName = path.basename(filePath);
      const files = await fs.readdir(dir);
      
      // Find backup files
      const backupPattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.backup\\.`);
      const backupFiles = files.filter(file => backupPattern.test(file));
      
      if (backupFiles.length === 0) {
        Logger.warn(`No backup files found for ${filePath}`);
        return null;
      }
      
      // Sort by name (timestamp) to get most recent
      backupFiles.sort().reverse();
      
      // Try to restore from most recent backup
      for (const backupFile of backupFiles) {
        const backupPath = path.join(dir, backupFile);
        try {
          const data = await fs.readFile(backupPath, "utf8");
          const parsed = JSON.parse(data);
          
          Logger.info(`Successfully restored from backup: ${backupFile}`);
          return parsed;
        } catch (error) {
          Logger.warn(`Backup ${backupFile} is also corrupted: ${error.message}`);
          continue;
        }
      }
      
      Logger.error("All backup files are corrupted");
      return null;
    } catch (error) {
      Logger.error(`Failed to restore from backup: ${error.message}`);
      return null;
    }
  }

  /**
   * List available backups for a file
   * @param {string} filePath - Original file path
   * @returns {Promise<Array>} - List of backup info
   */
  static async listBackups(filePath) {
    try {
      const dir = path.dirname(filePath);
      const baseName = path.basename(filePath);
      const files = await fs.readdir(dir);
      
      const backupPattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.backup\\.`);
      const backups = [];
      
      for (const file of files) {
        if (backupPattern.test(file)) {
          const backupPath = path.join(dir, file);
          try {
            const stats = await fs.stat(backupPath);
            backups.push({
              name: file,
              path: backupPath,
              size: stats.size,
              created: stats.mtime,
              timestamp: file.split('.backup.')[1]
            });
          } catch (error) {
            Logger.warn(`Could not stat backup ${file}: ${error.message}`);
          }
        }
      }
      
      return backups.sort((a, b) => b.created - a.created);
    } catch (error) {
      Logger.error(`Failed to list backups: ${error.message}`);
      return [];
    }
  }

  /**
   * Get file size in bytes
   * @param {string} filePath - Path to file
   * @returns {Promise<number>} - File size in bytes
   */
  static async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Backup existing file (legacy method for compatibility)
   * @param {string} filePath - Path to file to backup
   */
  static async backupFile(filePath) {
    return this.createVersionedBackup(filePath, 5);
  }
}

module.exports = FileUtils;
