import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { DatabaseService } from '../../database/database.service'
import type { ConvertLeadDto } from './dto'
@Injectable()
export class S303BeLeadConversionService {
  constructor(private readonly db: DatabaseService) {}
  async convert(leadId: string, dto: ConvertLeadDto) {
    return this.db.transaction(async (client) => {
      const lead = await client.query<{ id: string; fullName: string; phone: string; email: string | null; status: string; convertedStudentId: string | null }>(`SELECT id, full_name AS "fullName", phone, email, status, converted_student_id AS "convertedStudentId" FROM leads WHERE id=$1 FOR UPDATE`, [leadId])
      const row = lead.rows[0]
      if (!row) throw new NotFoundException('Không tìm thấy lead')
      if (row.convertedStudentId) {
        const existing = await client.query(`SELECT id, student_code AS "studentCode", status FROM students WHERE id=$1`, [row.convertedStudentId])
        return { data: existing.rows[0], alreadyConverted: true }
      }
      if (!['WON', 'QUALIFIED', 'CONSULTING'].includes(row.status)) throw new BadRequestException('Lead phải ở trạng thái QUALIFIED, CONSULTING hoặc WON trước khi chuyển đổi')
      const studentCode = dto.studentCode ?? `HV-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${randomUUID().slice(0, 6).toUpperCase()}`
      const student = await client.query(`INSERT INTO students(student_code, entry_level, notes, status) VALUES($1,$2,$3,'ACTIVE') RETURNING id, student_code AS "studentCode", entry_level AS "entryLevel", notes, status`, [studentCode, dto.entryLevel ?? null, dto.notes ?? `Chuyển từ lead ${row.fullName}`])
      await client.query(`UPDATE leads SET status='ENROLLED', converted_student_id=$2, updated_at=now() WHERE id=$1`, [leadId, student.rows[0].id])
      return { data: student.rows[0], lead: { id: row.id, fullName: row.fullName, phone: row.phone, email: row.email }, alreadyConverted: false }
    })
  }
}
