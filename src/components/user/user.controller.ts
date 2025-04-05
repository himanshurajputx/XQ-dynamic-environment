import { Body, Controller, Post, Req, Version } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { UserResponseInterface } from './interfaces/user.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('add-user')
  @Version('1')
  async createAUser(
    @Req() req: Request,
    @Body() body: CreateUserDto,
  ): Promise<UserResponseInterface> {
    console.log('>>>>>>>', req['user']);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const user_id = req['user']._id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user: UserResponseInterface = await this.userService.userCreate(
      body,
      user_id,
    );
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user_id: user['_id'],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      requestId: req.headers['x-request-id'],
    };
  }
}
