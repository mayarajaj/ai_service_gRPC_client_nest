import { Controller, Post, Body, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface AiAgentService {
  classifyConversation(data: { conversation: string }): Observable<{ result_json: string }>;
}

@Controller()
export class AppController implements OnModuleInit {
  private aiAgentService: AiAgentService;

  constructor(@Inject('AI_AGENT_PACKAGE') private client: ClientGrpc) {}

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
}
