import { isJSONable } from './is-jsonable';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerOption {
  level?: LogLevel;
  collapsed?: boolean;
  prefix?: string;
  time?: boolean;
}

const defaultLoggerOption = (): Required<LoggerOption> => {
  return {
    level:
      process.env.NODE_ENV === 'production' ?
        ('warn' as const)
      : ('debug' as const),
    collapsed: true,
    prefix: '',
    time: false,
  };
};

export interface Logger {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export const createLogger = (option?: LoggerOption) => {
  // destruct options
  const config = {
    ...defaultLoggerOption(),
    ...option,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const log = (level: LogLevel, message: string, ...args: any[]): void => {
    // check log level
    if (priority(config.level) > priority(level)) {
      return;
    }
    // prefix
    const prefix = createPrefix(config);
    // single message
    if (args.length === 0) {
      console[level](`${prefix}${message}`);
      return;
    }
    // group
    if (config.collapsed) {
      console.groupCollapsed(`${prefix}${message}`);
    } else {
      console.group(`${prefix}${message}`);
    }
    // args
    for (const arg of args) {
      if (isJSONable(arg)) {
        try {
          console[level](JSON.stringify(arg, null, 2));
        } catch (error: unknown) {
          console[level](arg);
        }
      } else {
        console[level](arg);
      }
    }
    // group end
    console.groupEnd();
  };

  return {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    debug(message: string, ...args: any[]): void {
      log('debug', message, ...args);
    },
    info(message: string, ...args: any[]): void {
      log('info', message, ...args);
    },
    warn(message: string, ...args: any[]): void {
      log('warn', message, ...args);
    },
    error(message: string, ...args: any[]): void {
      log('error', message, ...args);
    },
    /* eslint-enable @typescript-eslint/no-explicit-any */
  };
};

export const logger = createLogger();

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

const createPrefix = (option: Required<LoggerOption>): string => {
  let prefix = '';
  if (option.time) {
    prefix += `${new Date().toISOString()} `;
  }
  if (option.prefix) {
    prefix += option.prefix;
  }
  return prefix;
};
