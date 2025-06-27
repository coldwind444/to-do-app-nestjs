import { forwardRef, Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { UserModule } from "../user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TokenModule } from "../token/token.module";
import { OtpModule } from "../otp/otp.module";
import { MailModule } from "../mail/mail.module";
import { GoogleAuthGuard } from "./google-auth.guard";
import { GoogleStrategy } from "./google.strategy";

@Module({
    controllers: [AuthController],
    providers: [AuthService, AuthGuard, GoogleStrategy],
    exports: [AuthService, AuthGuard],
    imports: [
        forwardRef(() => UserModule),
        ConfigModule, // Ensure ConfigModule is available in this module
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                global: true,
                secret: config.get<string>('SIGNER_KEY'),
                signOptions: { expiresIn: '1800s' },
            }),
        }),
        TokenModule,
        OtpModule,
        MailModule
    ],
})
export class AuthModule { }
