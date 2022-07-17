import { NextResponse } from "next/server";

import meta from "tmp/meta.json";

import type { NextRequest } from "next/server";

const issues = Object.entries(meta).reduce(
  (acc, [key, value]) => [...acc, value.id],
  [] as string[]
);

const isNextAsset = (pathname: string) => {
  return /^_next\//.test(pathname);
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const path = pathname.split("/")[1];
  const isValidIssue = issues.includes(path);

  if (isNextAsset(pathname) || isValidIssue == false) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL(`/_issue_/${path}`, req.url));
}

export const config = {
  matcher: ["/:id*"],
};
