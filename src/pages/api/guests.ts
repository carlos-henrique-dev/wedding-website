// import type { NextApiRequest, NextApiResponse } from 'next'
// import { IGuest } from '@/interfaces'

// import { FireStoreAdapter } from '@/infra'

// export default async function handler(req: NextApiRequest, res: NextApiResponse<IGuest>) {
//   const database = new FireStoreAdapter()

//   const guest = await database.getOne(req.query.code as string)

//   res.status(200).json(guest)
// }
