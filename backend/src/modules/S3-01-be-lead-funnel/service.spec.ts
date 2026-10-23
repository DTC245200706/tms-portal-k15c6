import { S301BeLeadFunnelService } from './service'
describe('S301BeLeadFunnelService', () => {
  it('returns stage counts and leads with optional filters', async () => {
    const db = { query: jest.fn().mockResolvedValueOnce({ rows: [{ status: 'NEW', count: '2' }], rowCount: 1 }).mockResolvedValueOnce({ rows: [{ id: 'lead-1', status: 'NEW' }], rowCount: 1 }) }
    const result = await new S301BeLeadFunnelService(db as never).getFunnel({ ownerId: 'owner-1' })
    expect(result).toEqual({ data: [{ id: 'lead-1', status: 'NEW' }], stages: { NEW: 2 }, total: 1 })
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(db.query.mock.calls[0][1]).toEqual(['owner-1'])
  })
})
