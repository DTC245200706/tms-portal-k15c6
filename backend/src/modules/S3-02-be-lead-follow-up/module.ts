import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../database/database.module'
import { S302BeLeadFollowUpController } from './controller'
import { S302BeLeadFollowUpService } from './service'
@Module({ imports: [DatabaseModule], controllers: [S302BeLeadFollowUpController], providers: [S302BeLeadFollowUpService], exports: [S302BeLeadFollowUpService] })
export class S302BeLeadFollowUpModule {}
