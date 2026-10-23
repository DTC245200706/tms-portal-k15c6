import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Pool, type PoolClient, type QueryResultRow } from 'pg'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name)
  readonly pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number(process.env.DB_POOL_MAX ?? 20),
    ssl: process.env.DB_SSL === 'true' || /sslmode=require|ssl=true/i.test(process.env.DATABASE_URL ?? '') ? { rejectUnauthorized: false } : undefined,
  })

  async onModuleInit() {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for production backend')
    await this.pool.query('SELECT 1')
    if (process.env.AUTO_MIGRATE !== 'false') {
      const databaseDir = [
        join(process.cwd(), 'src/database'),
        join(process.cwd(), 'backend/src/database'),
        join(__dirname, '../../src/database'),
        __dirname,
      ].find((candidate) => existsSync(join(candidate, 'schema.sql')))
      if (!databaseDir) throw new Error('Database schema files were not found')
      const schema = readFileSync(join(databaseDir, 'schema.sql'), 'utf8')
      await this.pool.query(schema)
      const seed = readFileSync(join(databaseDir, 'seed.sql'), 'utf8')
      await this.pool.query(seed)
    }
    this.logger.log('PostgreSQL connected and schema is ready')
  }

  query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) { return this.pool.query<T>(text, params) }
  async transaction<T>(work: (client: PoolClient) => Promise<T>) {
    const client = await this.pool.connect()
    try { await client.query('BEGIN'); const result = await work(client); await client.query('COMMIT'); return result } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
  }
  async onModuleDestroy() { await this.pool.end() }
}
