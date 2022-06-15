import { Octokit as createOctokit } from "@octokit/rest";
import { throttling } from "@octokit/plugin-throttling";

const Octokit = createOctokit.plugin(throttling);

const REPO_OWNER = "rust-lang";
const REPO_NAME = "this-week-in-rust";

type ThrottleOptions = {
  method: string;
  url: string;
  request: { retryCount: number };
};

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  throttle: {
    onRateLimit: (retryAfter: number, options: ThrottleOptions) => {
      console.warn(
        `Request quota exhausted for request ${options.method} ${options.url}. Retrying after ${retryAfter} seconds.`
      );

      return true;
    },
    onAbuseLimit: (retryAfter: number, options: ThrottleOptions) => {
      // does not retry, only logs a warning
      octokit.log.warn(
        `Abuse detected for request ${options.method} ${options.url}`
      );
    },
  },
});

/**
 * It downloads a file from a GitHub repository
 * @param {string} path - The path to the file you want to download.
 * @returns A string
 */
async function downloadFile(path: string): Promise<string> {
  const { data } = await octokit.repos.getContent({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path,
  });

  if ("content" && "encoding" in data) {
    const encoding = data.encoding as Parameters<typeof Buffer.from>["1"];
    return Buffer.from(data.content, encoding).toString();
  }

  console.error(data);
  throw new Error(
    `Tried to get ${path} but got back something that was unexpected. It doesn't have a content or encoding property`
  );
}

/**
 *
 * @param path the full path to list
 * @returns a promise that resolves to a file ListItem of the files/directories in the given directory (not recursive)
 */
async function downloadDirList(path: string) {
  const { data } = await octokit.repos.getContent({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path,
  });

  if (!Array.isArray(data)) {
    throw new Error(
      `Tried to download content from ${path}. GitHub did not return an array of files. This should never happen...`
    );
  }

  return data;
}

export { downloadFile, downloadDirList };
