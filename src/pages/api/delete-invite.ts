import type { NextApiRequest, NextApiResponse } from 'next'
import { IGuest } from '@/interfaces'

import { FireStoreAdapter } from '@/infra'

export default async function handler(req: NextApiRequest, res: NextApiResponse<IGuest>) {
  const database = new FireStoreAdapter()

  const { code } = JSON.parse(req.body)
  const invite = await database.deleteInvite(code)

  res.status(200).json(invite)
}
