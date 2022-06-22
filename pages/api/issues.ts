import type { NextApiRequest, NextApiResponse } from "next";
import { getAllIssues } from "@lib/octokit";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const issues = await (
    await getAllIssues()
  ).map((issue) => ({ ...issue, text: "" }));
  res.status(200).json(issues);
};
