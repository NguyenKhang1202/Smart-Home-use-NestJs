import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/entities/role.enum';
import { ROLES_KEY } from 'src/security/decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // chỉ khi đúng roles mới cho thực thi
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // Nếu không có requiredRoles or requiredRoles = [] thì return true
    if (!requiredRoles || requiredRoles.length == 0) return true;
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;
    if (user.role === Role.ADMIN) return true;
    return requiredRoles.some((role) => user.role === role);
  }
}
