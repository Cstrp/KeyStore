import { EventEmitterModule } from '@nestjs/event-emitter';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      global: true,
      maxListeners: 50,
      ignoreErrors: false,
    }),
  ],
})
export class EventsModule {}
