import { env } from './config/env';
import { startServer } from './bootstrap/startServer';
import { createLogger } from './shared/infrastructure/logging/logger';

const logger = createLogger({ level: env.logLevel, nodeEnv: env.nodeEnv });

async function bootstrap() {
  try {
    await startServer({ env, logger });
  } catch (error) {
    logger.error({ err: error }, 'Failed to bootstrap backend');
    process.exit(1);
  }
}

bootstrap();
