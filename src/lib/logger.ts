export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerOption {
  level?: LogLevel;
  collapsed?: boolean;
}

const defaultLoggerOption = (): Required<LoggerOption> => {
  return {
    level:
      process.env.NODE_ENV === 'production'
        ? ('warn' as const)
        : ('debug' as const),
    collapsed: true,
  };
};

export class Logger {
  private level: LogLevel;
  private collapsed: boolean;

  constructor(option?: LoggerOption) {
    // destruct options
    const { level, collapsed } = {
      ...defaultLoggerOption(),
      ...option,
    };
    this.level = level;
    this.collapsed = collapsed;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private log(level: LogLevel, message: string, ...args: any[]): void {
    // check log level
    if (priority(this.level) > priority(level)) {
      return;
    }
    // single message
    if (args.length === 0) {
      console[level](message);
      return;
    }
    // group
    if (this.collapsed) {
      console.groupCollapsed(message);
    } else {
      console.group(message);
    }
    // args
    for (const arg of args) {
      // error
      if (arg instanceof Error) {
        console[level](arg);
      } else {
        try {
          console[level](JSON.stringify(arg, null, 2));
        } catch (error: unknown) {
          console[level](arg);
        }
      }
    }
    // group end
    console.groupEnd();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }
}

const priority = (level: LogLevel) => {
  switch (level) {
    case 'debug':
      return 0;
    case 'info':
      return 1;
    case 'warn':
      return 2;
    case 'error':
      return 3;
    default: {
      const _: never = level;
      return _;
    }
  }
};

export const createLogger = (option?: LoggerOption) => {
  return new Logger(option);
};

export const logger = createLogger();
