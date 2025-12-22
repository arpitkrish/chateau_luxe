const fs = require('fs');
const path = require('path');

// Custom logger module
class Logger {
  constructor(logFile = 'app.log') {
    this.logFile = path.join(__dirname, '..', 'logs', logFile);
    // Ensure logs directory exists
    if (!fs.existsSync(path.dirname(this.logFile))) {
      fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
    }
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(this.logFile, logMessage);
  }

  info(message) {
    this.log('info', message);
  }

  error(message) {
    this.log('error', message);
  }

  warn(message) {
    this.log('warn', message);
  }
}

module.exports = Logger;