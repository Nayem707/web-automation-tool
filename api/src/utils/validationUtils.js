/**
 * Validation utility functions
 */
class ValidationUtils {
  /**
   * Validate player data against required schema
   * @param {Object} player - Player data object
   * @returns {Object} - Validation result with isValid and errors
   */
  static validatePlayer(player) {
    const errors = [];

    // Required fields
    if (!player.firstName || typeof player.firstName !== "string") {
      errors.push("firstName is required and must be a string");
    }

    if (!player.lastName || typeof player.lastName !== "string") {
      errors.push("lastName is required and must be a string");
    }

    if (!player.team || typeof player.team !== "string") {
      errors.push("team is required and must be a string");
    }

    if (!player.position || typeof player.position !== "string") {
      errors.push("position is required and must be a string");
    }

    // Optional but typed fields
    if (player.height && typeof player.height !== "string") {
      errors.push("height must be a string when provided");
    }

    if (player.weight && typeof player.weight !== "string") {
      errors.push("weight must be a string when provided");
    }

    if (player.championships && typeof player.championships !== "number") {
      errors.push("championships must be a number when provided");
    }

    if (
      player.difficulty &&
      (typeof player.difficulty !== "number" ||
        player.difficulty < 1 ||
        player.difficulty > 5)
    ) {
      errors.push("difficulty must be a number between 1 and 5");
    }

    if (player.isActive && typeof player.isActive !== "boolean") {
      errors.push("isActive must be a boolean when provided");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize player name
   * @param {string} name - Raw name
   * @returns {string} - Sanitized name
   */
  static sanitizeName(name) {
    if (!name) return "";

    return name
      .trim()
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/[^\w\s-]/g, "") // Remove special characters except hyphens
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }

  /**
   * Sanitize team name
   * @param {string} team - Raw team name
   * @returns {string} - Sanitized team name
   */
  static sanitizeTeam(team) {
    if (!team) return "";

    const teamMap = {
      ATL: "Atlanta Hawks",
      BOS: "Boston Celtics",
      BKN: "Brooklyn Nets",
      CHA: "Charlotte Hornets",
      CHI: "Chicago Bulls",
      CLE: "Cleveland Cavaliers",
      DAL: "Dallas Mavericks",
      DEN: "Denver Nuggets",
      DET: "Detroit Pistons",
      GSW: "Golden State Warriors",
      HOU: "Houston Rockets",
      IND: "Indiana Pacers",
      LAC: "Los Angeles Clippers",
      LAL: "Los Angeles Lakers",
      MEM: "Memphis Grizzlies",
      MIA: "Miami Heat",
      MIL: "Milwaukee Bucks",
      MIN: "Minnesota Timberwolves",
      NOP: "New Orleans Pelicans",
      NYK: "New York Knicks",
      OKC: "Oklahoma City Thunder",
      ORL: "Orlando Magic",
      PHI: "Philadelphia 76ers",
      PHX: "Phoenix Suns",
      POR: "Portland Trail Blazers",
      SAC: "Sacramento Kings",
      SAS: "San Antonio Spurs",
      TOR: "Toronto Raptors",
      UTA: "Utah Jazz",
      WAS: "Washington Wizards",
    };

    return teamMap[team] || team;
  }

  /**
   * Convert height string to standardized format
   * @param {string} height - Height in various formats
   * @returns {string|null} - Height in cm format
   */
  static convertHeight(height) {
    if (!height) return null;

    // Handle feet-inches format (e.g., "6-8", "6'8\"")
    const feetInchesMatch = height.match(/(\d+)[\s\-']*(\d+)/);
    if (feetInchesMatch) {
      const feet = parseInt(feetInchesMatch[1]);
      const inches = parseInt(feetInchesMatch[2]);
      const totalInches = feet * 12 + inches;
      const cm = Math.round(totalInches * 2.54);
      return `${cm}cm`;
    }

    // Handle cm format
    const cmMatch = height.match(/(\d+)\s*cm/i);
    if (cmMatch) {
      return `${cmMatch[1]}cm`;
    }

    return null;
  }
}

module.exports = ValidationUtils;
