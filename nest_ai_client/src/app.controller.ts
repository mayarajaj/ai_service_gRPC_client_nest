import { Controller, Post, Body, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

// Interface matching the gRPC service methods
interface AiAgentService {
  classifyConversation(data: { conversation: string }): Observable<{ result_json: string }>;
  evolveConversation(data: { conversation: string; json: string }): Observable<{ evolution_result: string }>;
}

@Controller()
export class AppController implements OnModuleInit {
  private aiAgentService: AiAgentService;

  constructor(@Inject('AI_AGENT_PACKAGE') private client: ClientGrpc) {}

  // On initialization, get the gRPC service
  onModuleInit() {
    this.aiAgentService = this.client.getService<AiAgentService>('AiAgentService');
  }

  @Post('classify')
  classifyConversation(@Body('conversation') conversation: string) {
    if (!conversation) {
      return { error: 'No conversation provided' };
    }
    return this.aiAgentService.classifyConversation({ conversation });
  }

  @Post('evolve')
  evolveConversation(
    @Body('conversation') conversation: string,
    @Body('json') json: string
  ) {
    if (!conversation || !json) {
      return { error: 'Missing conversation or JSON data' };
    }
    return this.aiAgentService.evolveConversation({ conversation, json });
  }
}
