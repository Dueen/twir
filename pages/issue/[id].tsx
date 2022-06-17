import * as React from "react";
import Head from "next/head";
import { MDXRemote } from "next-mdx-remote";
import { motion, AnimatePresence } from "framer-motion";

import { downloadFile } from "@lib/octokit";
import { issues } from "@data/issues";
import { parse } from "@lib/mdx";

import type {
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next/types";

type GetStaticPropsResult = InferGetStaticPropsType<typeof getStaticProps>;

export async function getStaticPaths() {
  const paths = issues.map((issue: any) => ({
    params: { id: issue.id },
  }));
  return {
    paths: paths,
    fallback: false,
  };
}

// /***** USING THIS TO CATCH THE ERRORS AND DEBUG *****/

// export async function getStaticProps({
//   params,
// }: GetStaticPropsContext<Params>) {
//   if (params && params.id) {
//     const issue = issues.find(
//       ({ id }: any) => String(id) === String(params.id)
//     );
//     const title = issue.title || "This Week In Rust";
//     const content = await downloadFile(issue.path);

//     const cleanContent = content
//       // fixes: Unexpected character `!` (U+0021)
//       //
//       .replace(/\<\!.*\>/, "")
//       // fixes: to create a link in MDX, use `[text](url)`
//       // maps <https://....> to [text](url)
//       .replace(linkRegex, replceLinks)
//       // fixes: Could not parse expression with acorn
//       // replaces lines inside of blockqoute with:  > ...
//       .replace(
//         /\{\% blockquote \%\}(.*)\{\% endblockquote \%\}/gis,
//         replaceBlockQoute
//       )
//       // fixes: Could not parse expression with acorn
//       // replaces the pull request with: [description](url)
//       .replace(pullRequestRegex, replacePullRequest);

//     const mdxContent = await serialize(cleanContent, {
//       mdxOptions: {
//         remarkPlugins: [remarkGfm],
//       },
//     });
//     return {
//       props: { title, mdxContent },
//     };
//   }
//   const mdxContent = await serialize("# Content not found");
//   return {
//     props: { title: "This Week In Rust", mdxContent },
//   };
// }

const DAY_IN_SECONDS = 24 * 60 * 60;

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const issue = issues.find(({ id }: any) => id === params?.id);
  const title = issue.title || `This Week In Rust ${issue.id}`;
  const content = await downloadFile(issue.path);
  issue.content = content;

  const mdxContent = await parse(issue);
  return {
    props: { title, mdxContent },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every day
    revalidate: DAY_IN_SECONDS,
  };
}

export default function Issue({ title, mdxContent }: GetStaticPropsResult) {
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
      </Head>
      <AnimatePresence exitBeforeEnter presenceAffectsLayout>
        <motion.div
          className="prose prose-stone max-w-none bg-stone-50 p-10 text-left dark:prose-invert dark:bg-stone-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={title}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <MDXRemote {...mdxContent} components={{}} />
        </motion.div>
      </AnimatePresence>
    </React.Fragment>
  );
}

/**
 * FIXME: FAILING ISSUES
 * 6: Unexpected character `+` (U+002B) in name -> (<corey+blog@octayn.net>)
 * 32: Unexpected character `)` (U+0029) in name -> [boehm-rs][https://github.com/huonw/boehm-rs), a `Gc<T](https://github.com/huonw/boehm-rs), a `Gc<T)` type with a real
 */
