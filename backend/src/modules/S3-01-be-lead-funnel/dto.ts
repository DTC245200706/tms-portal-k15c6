import { IsDateString, IsIn, IsOptional, IsUUID } from 'class-validator'
export const LEAD_FUNNEL_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONSULTING', 'WON', 'LOST', 'ENROLLED', 'REJECTED'] as const
export type LeadFunnelStatus = (typeof LEAD_FUNNEL_STATUSES)[number]
export class LeadFunnelQueryDto {
  @IsOptional() @IsUUID() ownerId?: string
  @IsOptional() @IsUUID() programId?: string
  @IsOptional() @IsDateString() from?: string
  @IsOptional() @IsDateString() to?: string
  @IsOptional() @IsIn(LEAD_FUNNEL_STATUSES, { each: true }) statuses?: LeadFunnelStatus[]
}
