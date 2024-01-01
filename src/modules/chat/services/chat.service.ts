import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRequestDTO } from '../dtos/request/chat-request.dto';
import { Chat, ChatDocument } from 'src/schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async getAllMessages(receiverId: string, userId: string) {
    if (!receiverId) {
      throw new HttpException('receiverId is required', HttpStatus.BAD_REQUEST);
    }

    const listChat = await this.chatModel
      .find({
        receiverId,
        senderId: userId,
      })
      .exec();

    return {
      success: true,
      data: listChat,
    };
  }

  async sendMessage(messageDto: ChatRequestDTO, userId: string) {
    const { receiverId, content } = messageDto;

    if (!receiverId || !content) {
      throw new HttpException(
        'receiverId and content is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    messageDto.senderId = userId;

    const createdMessage = new this.chatModel(messageDto);
    createdMessage.save();

    return {
      success: true,
      data: messageDto,
    };
  }
}
