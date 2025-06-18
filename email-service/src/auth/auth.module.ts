import { Module } from '@nestjs/common';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [NodemailerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
