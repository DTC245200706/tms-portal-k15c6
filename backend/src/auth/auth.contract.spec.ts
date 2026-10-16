import { AUTH_ROUTES, PERMISSIONS, ROLE_PERMISSIONS } from './auth.contract'

describe('auth contract', () => {
  it('defines the expected authentication routes', () => {
    expect(AUTH_ROUTES.login).toBe('POST /auth/login')
    expect(AUTH_ROUTES.refresh).toBe('POST /auth/refresh')
    expect(AUTH_ROUTES.logout).toBe('POST /auth/logout')
    expect(AUTH_ROUTES.changePassword).toBe('POST /auth/change-password')
  })

  it('keeps admin and training manager permissions complete', () => {
    expect(ROLE_PERMISSIONS.ADMIN).toEqual(Object.values(PERMISSIONS))
    expect(ROLE_PERMISSIONS.TRAINING_MANAGER).toEqual(Object.values(PERMISSIONS))
  })

  it('does not grant permissions to guests', () => {
    expect(ROLE_PERMISSIONS.GUEST).toEqual([])
  })
})
