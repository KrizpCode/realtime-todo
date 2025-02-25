import { execSync } from 'child_process'
import dotenv from 'dotenv'

export default async () => {
  dotenv.config({ path: '.env.test' })

  execSync('pnpm prisma migrate reset --force --skip-seed', {
    stdio: 'inherit'
  })
}
