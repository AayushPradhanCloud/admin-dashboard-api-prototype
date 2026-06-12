import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { connect, NatsConnection, JetStreamClient, JetStreamManager, AckPolicy, DeliverPolicy, nanos } from 'nats';

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

      // Ensure the stream exists. In a real deployment the benefit-store peer owns
      // NUERA_ENROLLMENT; for local dev we create it if missing so a single broker works.
      const streams = await this.jsm.streams.list().next();
      const streamExists = streams.find((s) => s.config.name === env.NATS_STREAM);

      if (!streamExists) {
        this.logger.log(`Creating JetStream stream ${env.NATS_STREAM}...`);
        await this.jsm.streams.add({
          name: env.NATS_STREAM,
          subjects: ['enrollment.application.*'],
        });
      }

      // Ensure our durable consumer exists (filters the whole enrollment.application.* space;
      // the message loop ignores subjects it does not care about).
      try {
        await this.jsm.consumers.info(env.NATS_STREAM, env.NATS_DURABLE);
      } catch {
        this.logger.log(`Creating durable consumer ${env.NATS_DURABLE} on ${env.NATS_STREAM}...`);
        await this.jsm.consumers.add(env.NATS_STREAM, {
          durable_name: env.NATS_DURABLE,
          ack_policy: AckPolicy.Explicit,
          deliver_policy: DeliverPolicy.All,
          filter_subject: env.NATS_FILTER_SUBJECT,
          max_deliver: 5,
          ack_wait: nanos(30_000),
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
