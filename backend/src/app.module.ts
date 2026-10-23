import { Controller, Get, Module } from '@nestjs/common'
import { AUTH_ROUTES } from './auth/auth.contract'
import { PilotController } from './api/pilot.controller'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth/auth.controller'
import { AuthService } from './auth/auth.service'
import { DatabaseService } from './database/database.service'
import { DatabaseModule } from './database/database.module'
import { S301BeLeadFunnelModule } from './modules/S3-01-be-lead-funnel/module'

@Controller()
class HealthController {
  @Get('/health')
  health() {
    return { status: 'ok', service: 'tms-backend', authRoutes: AUTH_ROUTES }
  }
}

@Module({ imports: [DatabaseModule, JwtModule.register({ secret: process.env.JWT_ACCESS_SECRET ?? 'tms-dev-secret-change-me' }), S301BeLeadFunnelModule], controllers: [HealthController, PilotController, AuthController], providers: [AuthService] })
export class AppModule {}
