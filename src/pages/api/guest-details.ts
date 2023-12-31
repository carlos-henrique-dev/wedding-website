import type { NextApiRequest, NextApiResponse } from "next";
import { IGuest } from "@/interfaces";

import { FireStoreAdapter } from "@/infra";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGuest | { error: string }>,
) {
  const database = new FireStoreAdapter();

  const guest = await database.getOne(req.query.code as string);

  if (guest !== null) {
    return res.status(200).json(guest);
  }

  return res.status(404).json({ error: "Not Found" });
}
