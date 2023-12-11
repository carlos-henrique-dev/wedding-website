import type { NextApiRequest, NextApiResponse } from "next";
import { IGuestList } from "@/interfaces";

import { FireStoreAdapter } from "@/infra";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGuestList>,
) {
  const database = new FireStoreAdapter();

  const guests = await database.getList();

  res.status(200).json(guests);
}
