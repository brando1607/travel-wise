import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('FREQUENT-USERS-SERVICE') private UserClient: ClientProxy,
    @Inject('AUTH-SERVICE') private AuthClient: ClientProxy,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {}
}
