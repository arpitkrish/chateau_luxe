const fs = require('fs').promises;
const path = require('path');

// Custom file handler module
class FileHandler {
  static async readFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return data;
    } catch (error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
  }

  static async writeFile(filePath, data) {
    try {
      await fs.writeFile(filePath, data, 'utf8');
    } catch (error) {
      throw new Error(`Error writing file: ${error.message}`);
    }
  }

  static async appendFile(filePath, data) {
    try {
      await fs.appendFile(filePath, data, 'utf8');
    } catch (error) {
      throw new Error(`Error appending to file: ${error.message}`);
    }
  }

  static async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }

  static async listFiles(dirPath) {
    try {
      const files = await fs.readdir(dirPath);
      return files;
    } catch (error) {
      throw new Error(`Error listing files: ${error.message}`);
    }
  }
}

module.exports = FileHandler;