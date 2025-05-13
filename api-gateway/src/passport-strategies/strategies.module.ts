import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  providers: [LocalStrategy, JwtStrategy],
  exports: [LocalStrategy, JwtStrategy],
  imports: [forwardRef(() => AuthModule)],
})
export class StrategiesModule {}
