import { Controller, Get, Query } from '@nestjs/common'
import { S301BeLeadFunnelService } from './service'
import { LeadFunnelQueryDto } from './dto'
@Controller('/api/v1/leads')
export class S301BeLeadFunnelController {
  constructor(private readonly service: S301BeLeadFunnelService) {}
  @Get('funnel') getFunnel(@Query() query: LeadFunnelQueryDto) { return this.service.getFunnel(query) }
}
