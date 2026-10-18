import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const origins = process.env.FRONTEND_ORIGIN?.split(',').map((item) => item.trim()).filter(Boolean)
  app.enableCors({ origin: origins?.length ? origins : true, credentials: true })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  await app.listen(Number(process.env.PORT ?? 3000), '0.0.0.0')
}

void bootstrap()
