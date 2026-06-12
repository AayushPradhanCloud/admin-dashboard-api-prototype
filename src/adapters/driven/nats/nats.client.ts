import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { connect, NatsConnection, JetStreamClient, JetStreamManager } from 'nats';

// eslint-disable-next-line boundaries/element-types
import { loadEnv } from '~/infrastructure/config/env';

@Injectable()
export class NatsClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NatsClient.name);
  private nc?: NatsConnection;
  private jsm?: JetStreamManager;
  private js?: JetStreamClient;

  async onModuleInit(): Promise<void> {
    const env = loadEnv();
    try {
      this.logger.log(`Connecting to NATS at ${env.NATS_URL}...`);
      this.nc = await connect({ servers: env.NATS_URL });
      this.logger.log(`Connected to NATS at ${this.nc.getServer()}`);

      this.jsm = await this.nc.jetstreamManager();
      this.js = this.nc.jetstream();

      // Ensure the stream exists
      const streams = await this.jsm.streams.list().next();
      const streamExists = streams.find((s) => s.config.name === env.NATS_STREAM);

      if (!streamExists) {
        this.logger.log(`Creating JetStream stream ${env.NATS_STREAM}...`);
        await this.jsm.streams.add({
          name: env.NATS_STREAM,
          subjects: ['enrollment.*.>'], // Capture enrollment subjects
        });
      }
    } catch (error) {
      this.logger.error('Failed to connect to NATS', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.nc) {
      this.logger.log('Draining NATS connection...');
      await this.nc.drain();
      await this.nc.close();
    }
  }

  jetstream(): JetStreamClient {
    if (!this.js) {
      throw new Error('JetStream is not initialized. Ensure onModuleInit has completed.');
    }
    return this.js;
  }

  jetstreamManager(): JetStreamManager {
    if (!this.jsm) {
      throw new Error('JetStreamManager is not initialized. Ensure onModuleInit has completed.');
    }
    return this.jsm;
  }

  getConnection(): NatsConnection {
    if (!this.nc) {
      throw new Error('NATS connection is not initialized.');
    }
    return this.nc;
  }
}
