import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../../../../base/decorators/role.decorator";
import { Role } from "../../../../base/enums/role.enum";
import { LoggerService } from "../../../../base/logger/logger.service";

@Injectable()
// Bảo vệ router
export class RolesGuard implements CanActivate {
    constructor (
        private reflector: Reflector,
        private logger: LoggerService
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        const user = context.switchToHttp().getRequest().user;
        // console.log(user);
        this.logger.log(`Checking role: ${JSON.stringify(user)}`);
        const hasRequiredRole = requiredRoles.some((role) => user && user.role === role)
        return hasRequiredRole;
    }
}