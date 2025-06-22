import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "./item.entity";
import { AuthModule } from "../auth/auth.module";
import { AuthGuard } from "../auth/auth.guard";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([Item]),
        JwtModule,
        AuthModule
    ],
    controllers: [ItemController],
    providers: [ItemService, AuthGuard]
})

export class ItemModule {}