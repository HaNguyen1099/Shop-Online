import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
// Bảo vệ router
export class JwtAuthGuard extends AuthGuard("jwt") {}