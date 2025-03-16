import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AI_AGENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'aiagent', // Must match package name in .proto
          protoPath: 'src/proto/ai_agent.proto',
          url: 'localhost:50051', // Python gRPC server URL
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
