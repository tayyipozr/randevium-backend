import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { AuthSignInRequest, AuthSignUpRequest, AuthUpdateRequest } from './dto';
import { GetUser, Public } from './decorator';
import { LoggerService } from 'src/utils';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly logger: LoggerService,
  ) {}

  @Public()
  @Post('signup')
  async signup(@Body() dto: AuthSignUpRequest): Promise<Tokens> {
    this.logger.log('New user signup attempt', 'AuthController');
    const tokens = await this.authService.signup(dto);
    this.logger.log('User signup successful', 'AuthController');
    return tokens;
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthSignInRequest): Promise<Tokens> {
    this.logger.log('User signin attempt', 'AuthController');
    const tokens = await this.authService.signin(dto);
    this.logger.log('User signin successful', 'AuthController');
    return tokens;
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(@GetUser('id') userId: string, @Req() req: Request) {
    this.logger.log(`User ${userId} signout attempt`, 'AuthController');
    const access_token = req.headers['authorization']?.split(' ')[1];
    return this.authService.signout(userId, access_token);
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Body('user_id') userId: string,
    @Body('refresh_token') refreshToken: string,
  ) {
    this.logger.log(
      `Token refresh attempt for user ${userId}`,
      'AuthController',
    );
    return this.authService.refresh(userId, refreshToken);
  }

  @Get('me')
  getMe(@GetUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  @Post('me')
  updateMe(
    @GetUser('id') userId: string,
    @Body('user') updateModel: AuthUpdateRequest,
  ) {
    return this.authService.updateMe(userId, updateModel);
  }

  @Post('check-user-phone')
  checkUserFromPhone(@Body('phone_number') phoneNumber: string) {
    return this.authService.checkUserFromPhone(phoneNumber);
  }
}
