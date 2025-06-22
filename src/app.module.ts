import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemModule } from './modules/item/item.module';
import { DataSource } from 'typeorm';
import { Item } from './modules/item/item.entity';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/user/user.entity';
import { ConfigModule } from '@nestjs/config';
import { InvalidatedToken } from './modules/token/token.entity';
import { Otp } from './modules/otp/otp.enity';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'tododb',
      entities: [Item, User, InvalidatedToken, Otp],
      synchronize: true
    }),
    ItemModule,
    UserModule,
    AuthModule,
  ]

})

export class AppModule {
  constructor(private dataSource : DataSource){}
}
