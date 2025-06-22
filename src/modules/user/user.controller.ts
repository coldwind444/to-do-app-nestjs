import { Body, Controller, ParseIntPipe, Post, Get, UseGuards, Request } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { ApiResponse } from "src/common/api-response.dto";
import { GetUserDto } from "./dtos/get-user.dto";
import { AuthGuard } from "../auth/auth.guard";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService : UserService
    ){}

    @Post('register')
    async register(@Body() req : CreateUserDto) : Promise<ApiResponse<boolean>> {
        await this.userService.create(req)
        return {
            status: 200,
            message: 'User registered.',
            data: true
        }
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    async getById(@Request() req ) : Promise<ApiResponse<GetUserDto>> {
        const { password, ...remain } = await this.userService.findByUsername(req.user.sub)
        return {
            status: 200,
            message: 'User profile found.',
            data: remain
        }
    }
}