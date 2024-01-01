import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './infa/http/chat.controller';
import { ChatService } from './services/chat.service';
import { Chat, ChatSchema } from 'src/schemas/chat.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    JwtModule.register({
      secret: 'secret-key',
      signOptions: { expiresIn: '10h' },
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export default class ChatModule {}
