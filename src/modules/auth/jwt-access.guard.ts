import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IS_PUBLIC_KEY } from './decorateur/public.decorateur';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
          IS_PUBLIC_KEY,
          [context.getHandler(), context.getClass()],
        );
        if (isPublic) return true;
        return super.canActivate(context);
      }

}

