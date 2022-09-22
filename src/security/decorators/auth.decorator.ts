import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Role } from 'src/users/entities/role.enum';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from './roles.decorators';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    Roles(...roles),
    ApiBearerAuth(),
    ApiResponse({ status: 403, description: 'Forbidden.' }),
    UseGuards(JwtAuthGuard),
    // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
