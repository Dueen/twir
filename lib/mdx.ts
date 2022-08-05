import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export const convertToHTML = async (md: string) => {
  const vFile = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(remarkFrontmatter, ["yaml"])
    .use(rehypeStringify)
    .process(md);

  const html = String(vFile)
    .replace(/\{\%\sblockquote\s\%\}/gi, "<blockquote>")
    .replace(/\{\%\sendblockquote\s\%\}/gi, "</blockquote>");

  return html;
};
