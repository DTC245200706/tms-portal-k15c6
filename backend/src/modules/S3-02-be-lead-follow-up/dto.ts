import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'
export const FOLLOW_UP_TYPES = ['CALL', 'MESSAGE', 'EMAIL', 'MEETING', 'NOTE'] as const
export type FollowUpType = (typeof FOLLOW_UP_TYPES)[number]
export class CreateLeadActivityDto {
  @IsIn(FOLLOW_UP_TYPES) activityType!: FollowUpType
  @IsString() @IsNotEmpty() @MaxLength(4000) content!: string
  @IsOptional() @IsDateString() nextFollowUpAt?: string
  @IsOptional() @IsUUID() actorId?: string
}
export class FollowUpQueryDto {
  @IsOptional() @IsDateString() from?: string
  @IsOptional() @IsDateString() to?: string
  @IsOptional() @IsUUID() ownerId?: string
}
