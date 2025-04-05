import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../../components/authentication/dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { regex } from '../regex';

@Injectable()
export class LocalAuthGuard {
  async canActivate(context: ExecutionContext): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const authHeader = request.headers['authorization'];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    if (!authHeader?.startsWith('Basic ')) {
      throw new UnauthorizedException(
        'Authorization header missing or invalid',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf8',
    );
    const [username, password] = credentials.split(':');

    const credentialsDto = plainToInstance(LoginDto, { username, password });
    const errors = await validate(credentialsDto);

    if (errors.length > 0) {
      const errorMessages = errors
        .flatMap((error) => Object.values(error.constraints || {}))
        .join('; ');
      throw new UnauthorizedException(errorMessages);
    }

    // Additional manual validation
    this.validateUsernameFormat(username);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    request['credentials'] = { username, password };
    return true;
  }

  private validateUsernameFormat(username: string) {
    const isPhone =
      regex.onlyNumbersWithPlusRegex.test(username) ||
      regex.onlyNumberRegex.test(username);

    if (isPhone) {
      if (!regex.phoneRegex.test(username)) {
        throw new UnauthorizedException(
          'Please enter a valid phone number with country code (e.g., +919999999999)',
        );
      }
    } else {
      if (!regex.emailRegex.test(username)) {
        throw new UnauthorizedException('Please enter a valid email address.');
      }
    }
  }
}
