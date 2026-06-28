const rpc = L.rpc;
export interface GitHubReleaseResponse {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: ReleaseAuthor;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  immutable: boolean;
  prerelease: boolean;
  created_at: Date;
  updated_at: Date;
  published_at: Date;
  assets: ReleaseAsset[];
  tarball_url: string;
  zipball_url: string;
  body: string;
}

export interface ReleaseAsset {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  uploader: ReleaseAuthor;
  content_type: string;
  state: string;
  size: number;
  digest: string;
  download_count: number;
  created_at: Date;
  updated_at: Date;
  browser_download_url: string;
}

export interface ReleaseAuthor {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
}

export interface UpdateProgress {
  stage: "idle" | "checking" | "downloading_pkg" | "uploading_pkg" | "verifying" | "installing" | "done" | "error";
  percent: number;
  loaded: number;
  total: number;
  message?: string;
}

export interface ReleaseInfo {
  tag_name: string;
  published_at: string;
  body: string;
  html_url: string;
  package_asset: ReleaseAsset | null;
  i18n_asset: ReleaseAsset | null;
}

// Declare RPC methods
export const callGetVersion = rpc.declare<{ version: string; pkg_type: "ipk" | "apk"; i18n_zh_cn_installed?: boolean }>({
  object: "luci.fluent",
  method: "get_version",
});

export const callStartDownload = rpc.declare<{ result: number; message?: string }, [string, string]>({
  object: "luci.fluent",
  method: "start_download",
  params: ["url", "i18n_url"],
});

export const callCheckDownload = rpc.declare<{ size: number; running: boolean; code?: number }>({
  object: "luci.fluent",
  method: "check_download",
});

export const callDoInstall = rpc.declare<{ result: number; message?: string }, [string, string]>({
  object: "luci.fluent",
  method: "do_install",
  params: ["hash", "i18n_hash"],
});

export class GitHubAPIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "GitHubAPIError";
    this.status = status;
  }
}

/**
 * Fetch the latest release details from GitHub API
 */
export async function fetchLatestRelease(channel: "stable" | "nightly", pkgType: "ipk" | "apk", token?: string): Promise<ReleaseInfo> {
  const url = channel === "nightly" ? "https://api.github.com/repos/LazuliKao/luci-theme-fluent/releases/tags/nightly" : "https://api.github.com/repos/LazuliKao/luci-theme-fluent/releases/latest";

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const response = await fetch(url, { headers });
  const data = (await response.json()) as GitHubReleaseResponse;
  if (!response.ok) {
    const errorData = data as {
      message?: string;
      documentation_url?: string;
    };
    const errorReason = errorData?.message ? `: ${errorData.message}` : "";
    throw new GitHubAPIError(`GitHub API returned status ${response.status}${errorReason}`, response.status);
  }

  const assets = data.assets || [];

  let package_asset: ReleaseAsset | null = null;
  let i18n_asset: ReleaseAsset | null = null;

  for (const asset of assets) {
    const name = String(asset.name || "");
    if (pkgType === "apk" && name.startsWith("luci-theme-fluent") && name.endsWith(".apk")) {
      package_asset = asset;
    } else if (pkgType === "ipk" && name.startsWith("luci-theme-fluent") && name.endsWith("_all.ipk")) {
      package_asset = asset;
    } else if (pkgType === "apk" && name.startsWith("luci-i18n-fluent") && name.endsWith(".apk")) {
      i18n_asset = asset;
    } else if (pkgType === "ipk" && name.startsWith("luci-i18n-fluent") && name.endsWith("_all.ipk")) {
      i18n_asset = asset;
    }
  }

  return {
    tag_name: String(data.tag_name || ""),
    published_at: String(data.published_at || ""),
    body: String(data.body || ""),
    html_url: String(data.html_url || ""),
    package_asset,
    i18n_asset,
  };
}

