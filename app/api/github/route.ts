import { NextResponse } from "next/server"
import { execSync } from "child_process"

export const dynamic = "force-dynamic"

function gh(cmd: string) {
  try {
    return JSON.parse(execSync(`gh ${cmd}`, { encoding: "utf-8", env: { ...process.env, HOME: "/Users/j.a.r.v.i.s" } }))
  } catch { return null }
}

export async function GET() {
  try {
    // Repos
    const repos = gh(`repo list christianbayona07 --json name,url,updatedAt,description,pushedAt --limit 10`) ?? []

    // Recent commits for each repo
    const repoData = repos.map((repo: any) => {
      const commits = gh(`api repos/christianbayona07/${repo.name}/commits --jq '[.[0:5] | .[] | {sha: .sha[0:7], message: .commit.message, date: .commit.author.date, author: .commit.author.name}]'`) ?? []
      const prs = gh(`pr list --repo christianbayona07/${repo.name} --json number,title,state,createdAt,url --limit 5`) ?? []
      const issues = gh(`issue list --repo christianbayona07/${repo.name} --json number,title,state,createdAt,url --limit 5`) ?? []
      return { ...repo, commits, prs, issues }
    })

    return NextResponse.json({
      repos: repoData,
      fetchedAt: new Date().toISOString(),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
