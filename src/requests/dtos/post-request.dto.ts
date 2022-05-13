import { IsNotEmpty, IsString } from 'class-validator';

export class PostRequestDto {
  @IsString()
  @IsNotEmpty()
  requestOption: string;

  @IsString()
  @IsNotEmpty()
  requestData: string;
}
