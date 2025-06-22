import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dtos/login.dto";
import { TokenDto } from "./dtos/token.dto";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from 'uuid'
import { InvalidatedTokenService } from "../token/token.service";
import { OtpService } from "../otp/otp.service";
import { OtpRequestDto} from "./dtos/otp-request.dto";
import { OtpResponseDto } from "./dtos/otp-response.dto";
import { MailService } from "../mail/mail.service";
import { ConfirmOtpDto } from "./dtos/confirm-otp.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService : UserService,
        private readonly jwtService : JwtService,
        private readonly tokenService: InvalidatedTokenService,
        private readonly otpService: OtpService,
        private readonly mailService: MailService
    ){}

    async logIn(req : LoginDto) : Promise<TokenDto> {
        const user = await this.userService.findByUsername(req.username)
        if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
        
        const matchPassword = await this.userService.match(req.password, user.password)
        if (!matchPassword) throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED)
        
        const payload = 
        { 
            sub: user.username, 
            userid: user.id,
            jti: uuidv4(),
            issuer: 'todoapp', 
            issueAt: new Date(),
            expires: Date.now()
        }

        var token = ""
        try {
            token = await this.jwtService.signAsync(payload)
        } catch (err) {
            throw new HttpException('Fail to generate token.', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return {
            jwt: token,
            success: true
        }
        
    }

    async refreshToken(username: string, userid: number, jti: string) : Promise<TokenDto> {
        await this.tokenService.create(userid, jti)
        
        const payload = 
        { 
            sub: username, 
            userid: userid,
            jti: uuidv4(),
            issuer: 'todoapp', 
            issueAt: new Date(),
            expires: Date.now()
        }

        var token = ""
        try {
            token = await this.jwtService.signAsync(payload)
        } catch (err) {
            throw new HttpException('Fail to generate token.', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return {
            jwt: token,
            success: true
        }
    }

    async isInvalidated(jti : string) : Promise<boolean> {
        return this.tokenService.invalid(jti)
    }

    async getOtp(req: OtpRequestDto) : Promise<OtpResponseDto> {
        const user = await this.userService.findByUsername(req.username)
        if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND)

        const otp = await this.otpService.generateOtp(user.id)

        try {
            await this.mailService.sendMail(
                req.email,
                'Reset your password',
                `Your One-Time-Password is ${otp}. This OTP will expire in 15 minutes. Please do not share it with anyone.`
            )
        } catch (err){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return {
            success: true,
            userid: user.id
        }
    }

    async validOtp(req: ConfirmOtpDto) : Promise<string> {
        const token = await this.otpService.generateToken(req.otp, req.userid)
        if (!token) throw new HttpException('Invalid OTP.', HttpStatus.NOT_ACCEPTABLE)
        return token
    }

    async resetPassword(req: ResetPasswordDto) : Promise<void> {
        const validSession = await this.otpService.validResetToken(req.token, req.userid)
        if (!validSession) throw new HttpException('Invalid reset token.', HttpStatus.NOT_ACCEPTABLE)

        await this.userService.changePassword(req.userid, req.password)
    }
}