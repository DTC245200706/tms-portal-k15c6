import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../../database/database.service'
import type { LeadFunnelQueryDto } from './dto'
@Injectable()
export class S301BeLeadFunnelService {
  constructor(private readonly db: DatabaseService) {}
  async getFunnel(query: LeadFunnelQueryDto) {
    const filters: string[] = []; const params: unknown[] = []
    const add = (sql: string, value: unknown) => { params.push(value); filters.push(sql.replace('?', `$${params.length}`)) }
    if (query.ownerId) add('l.owner_id = ?', query.ownerId)
    if (query.programId) add('l.interested_program_id = ?', query.programId)
    if (query.from) add('l.created_at >= ?', query.from)
    if (query.to) add("l.created_at < (?::date + interval '1 day')", query.to)
    if (query.statuses?.length) { params.push(query.statuses); filters.push(`l.status = ANY($${params.length})`) }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    const [counts, leads] = await Promise.all([
      this.db.query<{ status: string; count: string }>(`SELECT l.status, count(*)::text AS count FROM leads l ${where} GROUP BY l.status ORDER BY array_position(ARRAY['NEW','CONTACTED','QUALIFIED','CONSULTING','WON','LOST','ENROLLED','REJECTED'], l.status)`, params),
      this.db.query(`SELECT l.id, l.full_name AS "fullName", l.phone, l.email, l.source, l.status, l.owner_id AS "ownerId", l.interested_program_id AS "programId", p.name AS "programName", l.created_at AS "createdAt", l.updated_at AS "updatedAt" FROM leads l LEFT JOIN programs p ON p.id=l.interested_program_id ${where} ORDER BY l.updated_at DESC, l.created_at DESC`, params),
    ])
    return { data: leads.rows, stages: Object.fromEntries(counts.rows.map((row) => [row.status, Number(row.count)])), total: leads.rowCount ?? 0 }
  }
}
