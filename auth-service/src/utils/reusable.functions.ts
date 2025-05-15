import { isEmailFunction } from 'src/auth/types';

export function isEmail(login: string | number): isEmailFunction {
  const isLoginUserEmail = typeof login === 'string';

  const cmd = isLoginUserEmail ? { cmd: 'getUserEmail' } : { cmd: 'getUser' };

  return cmd;
}
