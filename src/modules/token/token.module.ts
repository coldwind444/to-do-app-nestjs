import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvalidatedToken } from "./token.entity";
import { InvalidatedTokenService } from "./token.service";

@Module({
    imports: [TypeOrmModule.forFeature([InvalidatedToken])],
    providers: [InvalidatedTokenService],
    exports: [InvalidatedTokenService]
})

export class TokenModule {}