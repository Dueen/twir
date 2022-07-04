import { NextResponse } from "next/server";

import { LAST_ISSUE_ID } from "@/lib/constants";

import type { NextRequest } from "next/server";

const PATTERNS = [
  [
    // @ts-ignore
    new URLPattern({ pathname: "/:id" }),
    ({ pathname }: any) => pathname.groups,
  ],
];

const params = (url: string) => {
  const input = url.split("?")[0];
  let result: Record<string, string> = {};

  for (const [pattern, handler] of PATTERNS) {
    const patternResult = pattern.exec(input);
    if (patternResult !== null && "pathname" in patternResult) {
      result = handler(patternResult);
      break;
    }
  }
  return result;
};

export async function middleware(request: NextRequest) {
  // const url = request.nextUrl.clone();
  // const { id } = params(request.url);
  // const isNumber = !isNaN(Number(id));
  // const isTooSmall = Number(id) < 1;
  // const isTooLarge = Number(id) > Number(LAST_ISSUE_ID);
  // if (isNumber && (isTooSmall || isTooLarge)) {
  //   url.pathname = "/";
  //   return NextResponse.redirect(url);
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:id*",
};
