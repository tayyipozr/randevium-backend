import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { AuthSignInRequest, AuthSignUpRequest } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Tokens } from './types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DragonflyService } from 'src/dragonfly';
import { LoggerService } from '../utils/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly cache: DragonflyService,
    private readonly logger: LoggerService,
  ) {}

  async signup(dto: AuthSignUpRequest): Promise<Tokens> {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          firstName: dto.firstName,
          lastName: dto.lastName,
          gender: dto.gender,
          hash,
        },
      });

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthSignInRequest) {
    this.logger.log(
      `Attempting sign in for user: ${dto.phoneNumber}`,
      'AuthService',
    );
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber: dto.phoneNumber },
    });

    if (!user) {
      this.logger.error(
        `User not found: ${dto.phoneNumber}`,
        null,
        'AuthService',
      );
      throw new ForbiddenException('User not found');
    }

    const valid = await argon.verify(user.hash, dto.password);

    if (!valid) throw new ForbiddenException('Invalid password');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signout(userId: string, access_token: string) {
    this.logger.log(`Processing signout for user: ${userId}`, 'AuthService');

    // Update user record
    await this.prisma.user.update({
      where: { id: userId, hashedRt: { not: null } },
      data: { hashedRt: null },
    });

    // Blacklist the current access token
    if (access_token) {
      await this.blacklistToken(access_token, 3600); // Blacklist for 1 hour
      this.logger.log(
        `Access token blacklisted for user: ${userId}`,
        'AuthService',
      );
    }
  }

  async refresh(userId: string, rt: string) {
    this.logger.log(`Refreshing tokens for user: ${userId}`, 'AuthService');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.hashedRt) {
      this.logger.error(
        `Refresh failed for user: ${userId}`,
        null,
        'AuthService',
      );
      throw new UnauthorizedException('Invalid refresh token');
    }

    const valid = await argon.verify(user.hashedRt, rt);
    if (!valid) {
      this.logger.warn(
        `Invalid refresh token used for user: ${userId}`,
        'AuthService',
      );
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokens = await this.getTokens(user.id, user.phoneNumber);
    await this.updateRtHash(user.id, tokens.refresh_token);

    // Blacklist the old refresh token
    await this.blacklistToken(rt, 604800); // 7 days

    return tokens;
  }

  async getTokens(userId: string, phoneNumber: string): Promise<Tokens> {
    const payload = { sub: userId, phoneNumber };
    const secretAt = this.config.get('JWT_AT_SECRET');
    const secretRt = this.config.get('JWT_RT_SECRET');

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: '50m',
        algorithm: 'HS256',
        secret: secretAt,
      }),
      this.jwt.signAsync(payload, {
        expiresIn: '1w',
        algorithm: 'HS256',
        secret: secretRt,
      }),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  async updateRtHash(userId: string, rt: string) {
    const hashedRt = await argon.hash(rt);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt },
    });
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: true,
        favoriteCompanies: true,
        images: true,
        employee: true,
      },
    });

    delete user.hash;
    delete user.hashedRt;

    return user;
  }

  async checkUserFromPhone(phoneNumber: string) {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber: phoneNumber },
    });

    if (!user) {
      throw new ForbiddenException(
        'Telefon numarası sistemde kayıtlı bir kullanıcıya ait değil',
      );
    }

    delete user.hash;
    delete user.hashedRt;
    delete user.token;

    return user;
  }

  async blacklistToken(token: string, expiresIn: number) {
    try {
      await this.cache.setString(`bl_${token}`, 'blacklisted', expiresIn);
      this.logger.log(`Token blacklisted successfully`, 'AuthService');
    } catch (error) {
      this.logger.error(
        'Failed to blacklist token',
        error.stack,
        'AuthService',
      );
      throw new InternalServerErrorException('Failed to blacklist token');
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const result = await this.cache.getString(`bl_${token}`);
      return result === 'blacklisted';
    } catch (error) {
      this.logger.error(
        'Error checking token blacklist',
        error.stack,
        'AuthService',
      );
      return false;
    }
  }
}
