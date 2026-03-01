import pino, { type Logger } from 'pino';

type CreateLoggerInput = {
  level?: string;
  nodeEnv?: string;
};

export function createLogger({ level = 'info', nodeEnv = 'development' }: CreateLoggerInput = {}): Logger {
  return pino({
    level,
    base: undefined,
    transport:
      nodeEnv === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname'
            }
          }
        : undefined
  });
}
