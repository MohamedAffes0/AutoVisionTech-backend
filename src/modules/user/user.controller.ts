import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create() {
    return this.userService.create();
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne() {
    return this.userService.findOne();
  }

  @Delete(':id')
  remove() {
    return this.userService.remove();
  }
}
