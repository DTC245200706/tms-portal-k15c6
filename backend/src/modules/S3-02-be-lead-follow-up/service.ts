import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '../../database/database.service'
import type { CreateLeadActivityDto, FollowUpQueryDto } from './dto'
@Injectable()
export class S302BeLeadFollowUpService {
  constructor(private readonly db: DatabaseService) {}
  async listActivities(leadId: string) {
    const lead = await this.db.query(`SELECT id, full_name AS "fullName", phone, email, status FROM leads WHERE id=$1`, [leadId])
    if (!lead.rowCount) throw new NotFoundException('Không tìm thấy lead')
    const activities = await this.db.query(`SELECT a.id, a.activity_type AS "activityType", a.content, a.next_follow_up_at AS "nextFollowUpAt", a.actor_id AS "actorId", u.full_name AS "actorName", a.created_at AS "createdAt" FROM lead_activities a LEFT JOIN users u ON u.id=a.actor_id WHERE a.lead_id=$1 ORDER BY a.created_at DESC`, [leadId])
    return { lead: lead.rows[0], data: activities.rows, total: activities.rowCount ?? 0 }
  }
  async createActivity(leadId: string, dto: CreateLeadActivityDto) {
    const result = await this.db.query(`INSERT INTO lead_activities(lead_id, actor_id, activity_type, content, next_follow_up_at) SELECT $1, $2, $3, $4, $5 WHERE EXISTS (SELECT 1 FROM leads WHERE id=$1) RETURNING id, lead_id AS "leadId", actor_id AS "actorId", activity_type AS "activityType", content, next_follow_up_at AS "nextFollowUpAt", created_at AS "createdAt"`, [leadId, dto.actorId ?? null, dto.activityType, dto.content.trim(), dto.nextFollowUpAt ?? null])
    if (!result.rowCount) throw new NotFoundException('Không tìm thấy lead')
    await this.db.query(`UPDATE leads SET status=CASE WHEN status='NEW' THEN 'CONTACTED' ELSE status END, updated_at=now() WHERE id=$1`, [leadId])
    return { data: result.rows[0] }
  }
  async listFollowUps(query: FollowUpQueryDto) {
    const filters: string[] = ['a.next_follow_up_at IS NOT NULL']; const params: unknown[] = []
    const add = (sql: string, value: unknown) => { params.push(value); filters.push(sql.replace('?', `$${params.length}`)) }
    if (query.from) add('a.next_follow_up_at >= ?', query.from)
    if (query.to) add("a.next_follow_up_at < (?::date + interval '1 day')", query.to)
    if (query.ownerId) add('l.owner_id = ?', query.ownerId)
    const result = await this.db.query(`SELECT a.id, a.lead_id AS "leadId", l.full_name AS "leadName", l.phone, l.owner_id AS "ownerId", a.activity_type AS "activityType", a.content, a.next_follow_up_at AS "nextFollowUpAt", a.created_at AS "createdAt" FROM lead_activities a JOIN leads l ON l.id=a.lead_id WHERE ${filters.join(' AND ')} ORDER BY a.next_follow_up_at ASC`, params)
    return { data: result.rows, total: result.rowCount ?? 0 }
  }
}
