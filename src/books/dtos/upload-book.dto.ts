import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { User } from 'src/users/models/user.model';
import { bookState } from '../types/book-state.type';

export class UploadBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsDate()
  @IsOptional()
  purchase: Date;

  @IsString()
  @IsNotEmpty()
  state: bookState;

  @IsNotEmpty()
  seller: User;
}
