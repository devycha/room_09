import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  Min,
  Max,
  IsNumber,
  IsOptional,
} from 'class-validator';
export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(4)
  @IsOptional()
  @Type(() => Number)
  grade: number;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;
}
