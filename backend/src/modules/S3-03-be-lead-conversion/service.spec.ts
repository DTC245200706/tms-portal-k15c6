import { S303BeLeadConversionService } from './service'
describe('S303BeLeadConversionService', () => {
  it('converts a qualified lead atomically', async () => {
    const client = { query: jest.fn()
      .mockResolvedValueOnce({ rows: [{ id: 'lead-1', fullName: 'Lan', phone: '0900', email: null, status: 'WON', convertedStudentId: null }] })
      .mockResolvedValueOnce({ rows: [{ id: 'student-1', studentCode: 'HV-1', status: 'ACTIVE' }] })
      .mockResolvedValueOnce({ rows: [] }) }
    const db = { transaction: async (work: (c: typeof client) => Promise<unknown>) => work(client) }
    const result = await new S303BeLeadConversionService(db as never).convert('lead-1', { studentCode: 'HV-1' })
    expect(result).toMatchObject({ alreadyConverted: false, data: { id: 'student-1' } })
    expect(client.query).toHaveBeenCalledTimes(3)
  })
})
