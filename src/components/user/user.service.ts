import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TABLE_ } from '../../shared';
import { Model } from 'mongoose';
import { UsersInterface } from './interfaces/user.interface';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(TABLE_.USERS)
    private readonly userModel: Model<UsersInterface>,
  ) {}
  async userFind(query?: object, projection?: object): Promise<CreateUserDto> {
    // eslint-disable-next-line no-useless-catch
    try {
      // @ts-ignore
      return await this.userModel.findOne(query, projection);
    } catch (e) {
      throw e;
    }
  }
  async userCreate(body?: CreateUserDto, user_id?: string): Promise<any> {
    // eslint-disable-next-line no-useless-catch
    try {
      console.log('>>>>', user_id);
      return await this.userModel.create(body);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
