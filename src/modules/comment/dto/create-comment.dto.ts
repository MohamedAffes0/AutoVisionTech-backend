import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

/**
 * Data Transfer Object for creating a comment.
 */
export class CreateCommentDto {
  @IsNotEmpty()
  @IsUUID()
  carId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
