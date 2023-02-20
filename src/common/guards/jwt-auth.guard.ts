import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { NO_AUTH } from '../constants/metatags';

// TODO: make it compatible with any strat

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const noAuth = this.reflector.getAllAndOverride(NO_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    return noAuth ? true : super.canActivate(context);
  }
}
