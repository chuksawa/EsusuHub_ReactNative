/**
 * Logger Utility
 * Centralized logging with different log levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 200;

  /**
   * Log a message
   */
  private log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };

    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console logging based on level
    if (__DEV__) {
      switch (level) {
        case 'debug':
          console.debug(`[${level.toUpperCase()}]`, message, data || '');
          break;
        case 'info':
          console.log(`[${level.toUpperCase()}]`, message, data || '');
          break;
        case 'warn':
          console.warn(`[${level.toUpperCase()}]`, message, data || '');
          break;
        case 'error':
          console.error(`[${level.toUpperCase()}]`, message, data || '');
          break;
      }
    }

    // In production, you might want to send errors to a logging service
    // Example: if (level === 'error') Sentry.captureMessage(message, {extra: data});
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  /**
   * Get logs
   */
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = new Logger();

