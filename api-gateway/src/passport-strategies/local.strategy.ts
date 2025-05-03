import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('AUTH-SERVICE') private AuthClient: ClientProxy) {
    super();
  }

  async validate(username: number | string, password: string): Promise<string> {
    try {
      const userLogin = await lastValueFrom(
        this.AuthClient.send({ cmd: 'validLogin' }, { username, password }),
      );

      if (!userLogin.result) {
        throw new UnauthorizedException(userLogin.message);
      }

      return userLogin.data;
    } catch (error) {
      throw error;
    }
  }
}
