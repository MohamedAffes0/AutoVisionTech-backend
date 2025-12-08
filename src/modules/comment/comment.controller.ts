import {
  Controller,
  Get,
  Post,
  Body,
  /*UseGuards,*/ Param,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
//import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('comments')
//@UseGuards(PermissionsGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Post /comments -> create a new comment
  @Post()
  @Public()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  // Get /comments/car/:carId -> get comments by car ID
  @Get('car/:carId')
  @Public()
  findByCarId(@Param('carId') carId: string) {
    return this.commentService.findByCarId(carId);
  }
}
