import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  create() {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne() {
    return `This action returns a  user`;
  }

  update() {
    return `This action updates a  user`;
  }

  remove() {
    return `This action removes a user`;
  }
}
