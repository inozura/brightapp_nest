import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatRequestDTO } from '../../dtos/request/chat-request.dto';
import { ChatService } from '../../services/chat.service';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Get('viewMessages/:id')
  async viewMessages(@Param('id') receiverId, @Request() req) {
    return this.chatService.getAllMessages(receiverId, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('sendMessage')
  async sendMessage(@Body() chatRequestDTO: ChatRequestDTO, @Request() req) {
    return this.chatService.sendMessage(chatRequestDTO, req.user.sub);
  }
}
