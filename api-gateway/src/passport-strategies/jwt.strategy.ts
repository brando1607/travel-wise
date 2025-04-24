import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getEnv } from 'src/utils/getEnv';
import { Request } from 'express';
import { Payload } from 'src/auth/types';

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['loginToken'];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: getEnv('TOKEN'),
    });
  }
  async validate(payload: Payload): Promise<Payload> {
    return payload;
  }
}
