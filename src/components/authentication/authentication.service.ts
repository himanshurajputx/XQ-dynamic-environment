import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import {
  hashCompare,
  INVALID_PASSWORD,
  IS_NOT_EXISTING,
  USER_STATUS_DEACTIVATE,
} from '../../shared';
import { CustomJwtService } from '../../shared/jwt/custom.jwt.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    readonly userService: UserService,
    readonly jwtService: CustomJwtService,
  ) {}
  async login(body: LoginDto) {
    const user = await this.userService.userFind({ email: body.username });
    if (user == null) throw new BadRequestException(IS_NOT_EXISTING);
    if (!user['status']) throw new BadRequestException(USER_STATUS_DEACTIVATE);
    const areEqual = await hashCompare(
      user.password,
      body.password,
      user['salt'],
    );
    if (!areEqual) throw new UnauthorizedException(INVALID_PASSWORD);
    const token = this.jwtService.sign({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      _id: user['_id'],
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      profile: user.profile,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      created_at: user['created_at'],
    });
    return token;
  }

  async register(body: RegisterDto) {
    // @ts-ignore
    const registerdUser = await this.userService.userCreate(body);
    console.log('>>>', registerdUser);
  }
}
