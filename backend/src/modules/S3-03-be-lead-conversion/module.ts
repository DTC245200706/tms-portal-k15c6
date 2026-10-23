import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../database/database.module'
import { S303BeLeadConversionController } from './controller'
import { S303BeLeadConversionService } from './service'
@Module({ imports: [DatabaseModule], controllers: [S303BeLeadConversionController], providers: [S303BeLeadConversionService], exports: [S303BeLeadConversionService] })
export class S303BeLeadConversionModule {}
