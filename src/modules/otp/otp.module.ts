import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Otp } from "./otp.enity";
import { OtpService } from "./otp.service";

@Module({
    imports: [TypeOrmModule.forFeature([Otp])],
    providers: [OtpService],
    exports: [OtpService]
})

export class OtpModule {}