import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Role } from 'src/users/entities/role.enum';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Roles } from './roles.decorators';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    Roles(...roles),
    ApiBearerAuth(),
    ApiResponse({ status: 403, description: 'Unauthorized' }),
    UseGuards(JwtAuthGuard),
  );
}
