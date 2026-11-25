import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password!: string;
}
