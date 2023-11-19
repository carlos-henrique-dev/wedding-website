import type { NextApiRequest, NextApiResponse } from 'next'
import { IGuest } from '@/interfaces'

import { FireStoreAdapter } from '@/infra'

export default async function handler(req: NextApiRequest, res: NextApiResponse<IGuest | { error: string }>) {
  if (req.method === 'POST') {
    const database = new FireStoreAdapter()

    const invite = await database.createInvite(JSON.parse(req.body))

    return res.status(200).json(invite)
  }

  if (req.method === 'PUT') {
    const database = new FireStoreAdapter()

    const invite = await database.updateInvite(JSON.parse(req.body))

    return res.status(200).json(invite)
  }

  return res.status(404).json({ error: 'Not Found' })
}
