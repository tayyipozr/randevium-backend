import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AtStrategy, RtStrategy } from "./strategy";

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, RtStrategy, AtStrategy],
    exports: [AuthService]
})
export class AuthModule { }