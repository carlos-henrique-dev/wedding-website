import type { NextApiRequest, NextApiResponse } from "next";
import { IGuestList } from "@/interfaces";

import { FireStoreAdapter } from "@/infra";
import { IGroup } from '@/interfaces/models/group';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGroup[]>,
) {
  const database = new FireStoreAdapter();

  const groups = await database.getGroups();

  return res.status(200).json(groups);
}
