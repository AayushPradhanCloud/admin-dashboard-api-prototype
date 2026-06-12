import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { LocalEventPublisher } from '~/adapters/driven/local/local-event.publisher';
import { ResourceController } from '~/adapters/driving/http/example/resource.controller';
import { CreateResourceCommandHandler } from '~/core/application/example/create-resource.command';
import { ListResourcesQueryHandler } from '~/core/application/example/list-resources.query';
import { ResourceCreatedHandler } from '~/core/application/example/resource-created.handler';
import { EVENT_PUBLISHER } from '~/core/application/ports/event-publisher.port';

const HANDLERS = [CreateResourceCommandHandler, ListResourcesQueryHandler, ResourceCreatedHandler];

@Module({
  imports: [CqrsModule],
  controllers: [ResourceController],
  providers: [...HANDLERS, LocalEventPublisher, { provide: EVENT_PUBLISHER, useClass: LocalEventPublisher }],
})
export class ExampleModule {}
