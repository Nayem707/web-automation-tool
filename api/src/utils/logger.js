const config = require("../config");

/**
 * ANSI color codes for terminal output
 */
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",

  // Foreground colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  // Background colors
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
};

/**
 * Colorized logger utility
 */
class Logger {
  static info(message, ...args) {
    const timestamp = new Date().toISOString();
    console.log(
      `${colors.dim}[${timestamp}]${colors.reset} ${colors.cyan}${colors.bright}INFO:${colors.reset}`,
      message,
      ...args,
    );
  }

  static error(message, ...args) {
    const timestamp = new Date().toISOString();
    console.error(
      `${colors.dim}[${timestamp}]${colors.reset} ${colors.red}${colors.bright}ERROR:${colors.reset}`,
      message,
      ...args,
    );
  }

  static warn(message, ...args) {
    const timestamp = new Date().toISOString();
    console.warn(
      `${colors.dim}[${timestamp}]${colors.reset} ${colors.yellow}${colors.bright}WARN:${colors.reset}`,
      message,
      ...args,
    );
  }

  static debug(message, ...args) {
    if (config.nodeEnv === "development") {
      const timestamp = new Date().toISOString();
      console.log(
        `${colors.dim}[${timestamp}]${colors.reset} ${colors.magenta}${colors.bright}DEBUG:${colors.reset}`,
        message,
        ...args,
      );
    }
  }

  static success(message, ...args) {
    const timestamp = new Date().toISOString();
    console.log(
      `${colors.dim}[${timestamp}]${colors.reset} ${colors.green}${colors.bright}SUCCESS:${colors.reset}`,
      message,
      ...args,
    );
  }
}

module.exports = Logger;
