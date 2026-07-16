/* eslint-disable perfectionist/sort-imports */
import 'dotenv/config'
import type { Express } from 'express'
import process from 'node:process'
import cors from 'cors'
import express from 'express'
import { corsOptions } from './config/cors'
import { errorMiddleware } from './middlewares/error.middleware'
import { apiRouter } from './routes/index'
/* eslint-enable perfectionist/sort-imports */

export const app: Express = express()

app.use(cors(corsOptions))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', apiRouter)

app.use(errorMiddleware)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app
