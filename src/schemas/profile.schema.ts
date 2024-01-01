import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop()
  userId: string;

  @Prop()
  displayName: string;

  @Prop()
  image: string;

  @Prop()
  gender: string;

  @Prop()
  birthday: Date;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop()
  interest: Array<string>;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
