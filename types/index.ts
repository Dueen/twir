export type Meta = {
  title: string;
};

import type { CookieSerializeOptions } from "cookie";
import type { IncomingMessage, ServerResponse } from "http";

export interface OptionsType extends CookieSerializeOptions {
  res?: ServerResponse;
  req?: IncomingMessage & {
    cookies?: { [key: string]: string } | Partial<{ [key: string]: string }>;
  };
}

export type TmpCookiesObj =
  | { [key: string]: string }
  | Partial<{ [key: string]: string }>;
export type CookieValueTypes = string | boolean | undefined | null;
