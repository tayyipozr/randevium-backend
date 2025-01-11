import { Body, Controller, Get, HttpCode, HttpStatus, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Tokens } from "./types";
import { AuthSignInRequest, AuthSignUpRequest } from "./dto";
import { GetUser, Public, Roles } from "./decorator";
import { RtGuard } from "./guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('signup')
    signup(@Body() dto: AuthSignUpRequest): Promise<Tokens> {
        return this.authService.signup(dto);
    }

    @Public()
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() dto: AuthSignInRequest): Promise<Tokens> {
        return this.authService.signin(dto);
    }

    @Post('signout')
    @HttpCode(HttpStatus.OK)
    signout(@GetUser('id', ParseIntPipe) userId: string) {
        return this.authService.signout(userId);
    }

    @UseGuards(RtGuard)
    @Post('refresh')
    refresh(@GetUser('id') userId: string, @GetUser('refreshToken') refreshToken: string) {
        return this.authService.refresh(userId, refreshToken);
    }

    @Get('me')
    getMe(@GetUser('id') userId: string) {
        return this.authService.getMe(userId);
    }
}