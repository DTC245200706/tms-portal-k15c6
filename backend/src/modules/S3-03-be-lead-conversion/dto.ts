import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
export class ConvertLeadDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(32) studentCode?: string
  @IsOptional() @IsString() @MaxLength(1000) notes?: string
  @IsOptional() @IsString() @MaxLength(80) entryLevel?: string
}
