import { Body, Controller, Param, Post } from '@nestjs/common'
import { S303BeLeadConversionService } from './service'
import { ConvertLeadDto } from './dto'
@Controller('/api/v1/leads')
export class S303BeLeadConversionController {
  constructor(private readonly service: S303BeLeadConversionService) {}
  @Post(':leadId/convert') convert(@Param('leadId') leadId: string, @Body() dto: ConvertLeadDto) { return this.service.convert(leadId, dto) }
}
