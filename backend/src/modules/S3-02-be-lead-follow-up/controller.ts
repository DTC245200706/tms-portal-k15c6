import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { S302BeLeadFollowUpService } from './service'
import { CreateLeadActivityDto, FollowUpQueryDto } from './dto'
@Controller('/api/v1/leads')
export class S302BeLeadFollowUpController {
  constructor(private readonly service: S302BeLeadFollowUpService) {}
  @Get('follow-ups') listFollowUps(@Query() query: FollowUpQueryDto) { return this.service.listFollowUps(query) }
  @Get(':leadId/activities') listActivities(@Param('leadId') leadId: string) { return this.service.listActivities(leadId) }
  @Post(':leadId/activities') createActivity(@Param('leadId') leadId: string, @Body() dto: CreateLeadActivityDto) { return this.service.createActivity(leadId, dto) }
}
