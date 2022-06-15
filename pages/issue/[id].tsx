import * as React from "react";
import Link from "next/link";
import Head from "next/head";
import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

import { downloadDirList, downloadFile } from "@lib/octokit";

import type {
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next/types";

type Params = {
  id: string;
};

type GetStaticPropsResult = InferGetStaticPropsType<typeof getStaticProps>;

const convertBlockQoute = (_: string, p: string) =>
  p
    .split("\n")
    .map((line: string) => `> ${line}`)
    .join("\n");

export async function getStaticPaths() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_page=1"
  );
  const postList = await response.json();
  return {
    paths: postList.map((post: any) => {
      return {
        params: {
          id: `${post.id}`,
        },
      };
    }),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<Params>) {
  // fetch the issue from github api
  if (params && params.id) {
    const content = await downloadFile(
      "content/2013-06-07-this-week-in-rust.markdown"
    );
    console.log({ content });

    const cleanContent = content
      // fixes: Unexpected character `!` (U+0021)
      //
      .replace(/\<\!.*\>/, "")
      // fixes: to create a link in MDX, use `[text](url)`
      // maps <https://....> to [text](url)
      .replace(/<([http|mailto:].*)>/gi, (_, p) => `[${p}](${p})`)
      // fixes: Could not parse expression with acorn
      // replaces lines inside of blockqoute with:  > ...
      .replace(
        /\{\% blockquote \%\}(.*)\{\% endblockquote \%\}/gis,
        convertBlockQoute
      );

    console.log({ cleanContent });

    const mdxContent = await serialize(cleanContent, {
      mdxOptions: {
        // remarkPlugins: [remarkGfm],
      },
    });
    return {
      props: { title: "", body: "", mdxContent },
    };
  }
  const mdxContent = await serialize("# Content not found");
  return {
    props: { title: "", body: "", mdxContent },
  };
}

export default function Issue({
  title,
  body,
  mdxContent,
}: GetStaticPropsResult) {
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="prose prose-stone max-w-none bg-stone-50 p-10 text-left dark:prose-invert dark:bg-stone-800">
        <MDXRemote {...mdxContent} components={{}} />
      </div>
    </React.Fragment>
  );
}
