import { Controller, Post, Body, UseGuards, Query, ParseBoolPipe, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TokenDto } from "./dtos/token.dto";
import { ApiResponse } from "src/common/api-response.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./auth.guard";
import { OtpRequestDto } from "./dtos/otp-request.dto";
import { OtpResponseDto } from "./dtos/otp-response.dto";
import { ConfirmOtpDto } from "./dtos/confirm-otp.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService : AuthService,
    ){}

    @Post('login')
    async logIn(@Body() body : LoginDto) : Promise<ApiResponse<TokenDto>>{
        const res = await this.authService.logIn(body)
        return {
            status: 200,
            message: 'Login success.',
            data: res
        }
    }

    @Post('refresh-token')
    @UseGuards(AuthGuard)
    async refreshToken(@Request() req, @Query('refresh', ParseBoolPipe) refresh : boolean) : Promise<ApiResponse<TokenDto>> {
        const res = await this.authService.refreshToken(req.user.sub, req.user.userid, req.user.jti)
        return {
            status: 200,
            message: 'Token refreshed.',
            data: res
        }
    }

    @Post('otp-request')
    async requestOtp(@Body() body: OtpRequestDto) : Promise<ApiResponse<OtpResponseDto>> {
        const res = await this.authService.getOtp(body)
        return {
            status: 200,
            message: 'Otp sent.',
            data: res
        }
    }

    @Post('otp-confirm')
    async confirmOtp(@Body() body : ConfirmOtpDto) : Promise<ApiResponse<string>> {
        const res = await this.authService.validOtp(body)
        return {
            status: 200,
            message: 'Otp confirmed.',
            data: res
        }
    }

    @Post('reset-password')
    async resetPassword(@Body() body: ResetPasswordDto) : Promise<ApiResponse<boolean>> {
        await this.authService.resetPassword(body)
        return {
            status: 200,
            message: 'Password reset.',
            data: true
        }
    }

}