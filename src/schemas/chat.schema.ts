import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop()
  senderId: string;

  @Prop()
  receiverId: string;

  @Prop()
  content: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
