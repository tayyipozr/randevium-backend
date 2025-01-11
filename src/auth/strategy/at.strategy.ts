import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(readonly config: ConfigService,
    private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_AT_SECRET"),
    });
  }

  async validate(payload: { sub: string, phoneNumber: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    delete user.hash;
    delete user.hashedRt;
    return user;
  }
}