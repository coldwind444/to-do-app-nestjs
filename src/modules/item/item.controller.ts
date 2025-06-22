import { Controller, Get, Post, Delete, Put, Query, ParseIntPipe, Body, UseGuards, Request, ParseBoolPipe } from "@nestjs/common";
import { ApiResponse } from "src/common/api-response.dto";
import { ItemService } from "./item.service";
import { Item } from "./item.entity";
import { CreateItemDto } from "./dtos/create-item.dto";
import { UpdateItemDto } from "./dtos/update-item.dto";
import { AuthGuard } from "../auth/auth.guard";

@Controller('items')
export class ItemController {
    constructor(private readonly itemService: ItemService) { }

    @Get()
    @UseGuards(AuthGuard)
    async findAll(@Request() req): Promise<ApiResponse<Item[]>> {
        const items = await this.itemService.findAll(req.user.userid)
        return {
            status: 200,
            message: 'All items fetched.',
            data: items
        }
    }

    @Put('update')
    @UseGuards(AuthGuard)
    async update(@Request() req, @Body() body : UpdateItemDto) : Promise<ApiResponse<UpdateItemDto>>{
        const { owner, createDate, ...res } = await this.itemService.update(req.user.userid, body)
        return {
            status: 200,
            message: 'Updated.',
            data: res
        }
    }

    @Get('status')
    @UseGuards(AuthGuard)
    async findByStatus(@Request() req, @Query('s', ParseBoolPipe) status : boolean) : Promise<ApiResponse<Item[]>> {
        const items = await this.itemService.findByStatus(req.user.userid, status)
        return {
            status: 200,
            message: `${status ? 'Finished' : 'Unfinished'} items fetched.`,
            data: items
        }
    }

    @Get('search')
    @UseGuards(AuthGuard)
    async findByName(@Request() req, @Query('name') name: string) : Promise<ApiResponse<Item[]>> {
        const items = await this.itemService.findByName(req.user.userid, name)
        return {
            status: 200,
            message: 'All items fetched.',
            data: items
        }
    }

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Request() req, @Body() body: CreateItemDto) : Promise<ApiResponse<Item>> {
        const item = await this.itemService.create(req.user.userid, body)
        return {
            status: 200,
            message: 'Task added.',
            data: item
        }
    }

    @Delete('delete')
    @UseGuards(AuthGuard)
    async remove(@Request() req, @Query('id', ParseIntPipe) id: number) : Promise<ApiResponse<boolean>>{
        await this.itemService.remove(req.user.userid, id)
        return {
            status: 200,
            message: "Delete success.",
            data: true
        }
    }
}
