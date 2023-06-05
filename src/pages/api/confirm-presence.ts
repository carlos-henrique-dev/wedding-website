import type { NextApiRequest, NextApiResponse } from 'next'
import { IGuest } from '@/interfaces'

import { FireStoreAdapter } from '@/infra'

export default async function handler(req: NextApiRequest, res: NextApiResponse<IGuest>) {
  const database = new FireStoreAdapter()

  const { code, members } = JSON.parse(req.body)
  const invite = await database.confirmPresence({ code, members })

  res.status(200).json(invite)
}
