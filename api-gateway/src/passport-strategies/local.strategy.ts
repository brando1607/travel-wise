import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH-SERVICE') private AuthClient: ClientProxy,
    @Inject('EMAIL-SERVICE') private emailClient: ClientProxy,
    @Inject('FREQUENT-USERS-SERVICE') private userClient: ClientProxy,
  ) {
    super();
  }

  async validate(username: number | string, password: string): Promise<string> {
    try {
      let getFailedLogins: any;
      const userLogin = await lastValueFrom(
        this.AuthClient.send({ cmd: 'validLogin' }, { username, password }),
      );

      //check if account is blocked
      const accountStatus = await lastValueFrom(
        this.userClient.send(
          { cmd: 'isAccountBlocked' },
          userLogin.data.memberNumber,
        ),
      );

      if (accountStatus.statusCode === 403) {
        throw new UnauthorizedException(accountStatus.message);
      }

      if (!userLogin.result) {
        if (userLogin.data.login === 'password') {
          getFailedLogins = await lastValueFrom(
            this.AuthClient.send(
              { cmd: 'getFailedLogins' },
              userLogin.data.memberNumber,
            ),
          );

          //increase failed logins
          await lastValueFrom(
            this.AuthClient.send(
              { cmd: 'increaseFailedLogins' },
              {
                memberNumber: userLogin.data.memberNumber,
                failedLogins: getFailedLogins.attempts,
              },
            ),
          );
        }

        if (getFailedLogins.attempts === 2) {
          const userEmail = await lastValueFrom(
            this.userClient.send(
              { cmd: 'getUser' },
              userLogin.data.memberNumber,
            ),
          );
          //block account
          await lastValueFrom(
            this.userClient.send(
              { cmd: 'blockAccount' },
              userEmail.data.memberNumber,
            ),
          );
          //send email
          await lastValueFrom(
            this.emailClient.send(
              { cmd: 'tooManyLoginAttempts' },
              {
                email: userEmail.data.email,
                memberNumber: userEmail.data.memberNumber,
              },
            ),
          );
        }

        throw new UnauthorizedException(userLogin.message);
      }

      return userLogin.data;
    } catch (error) {
      throw error;
    }
  }
}
