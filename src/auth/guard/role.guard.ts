// src/auth/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum';
import { ROLES_KEY } from '../decorator';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the required roles from the decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      // If no roles are required, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const user = await this.authService.getMe(userId);

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    // Access role names
    const userRoles = user.roles.map((role) => role.name);
    // Check if user has at least one required role
    const hasRole = requiredRoles.some((role) => userRoles.includes(role as string));


    if (!hasRole) {
      throw new ForbiddenException(
        `You do not have ${requiredRoles} permission`,
      );
    }

    return hasRole;
  }
}
