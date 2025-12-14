# GitHub Actions Workflows

The project uses a single bundled workflow file `.github/workflows/main.yml` to manage all CI/CD and security tasks. This ensures a clear view of the project status for every commit.

## 🚀 Main Workflow (`main.yml`)

This workflow runs on:
- **Push**: `main`, `develop`, `feature/*`
- **Pull Request**: `main`, `develop`
- **Schedule**: Daily at 2 AM UTC

### Jobs Overview

The workflow uses `dorny/paths-filter` to only run relevant jobs based on changed files.

| Job | Description | Triggers On |
|-----|-------------|-------------|
| **Backend CI** | Lint, Type Check, Test (Bun) | `src/**`, `package.json`, `tsconfig.json` |
| **Frontend CI** | Lint, Type Check, Build, Test (Node) | `frontend/**` |
| **SDK CI** | Build, Type Check, Test (Node) | `sdk/**` |
| **Security Audits** | `bun audit` / `npm audit` | Respective paths (Backend/Frontend/SDK) |
| **Docker Scan** | Trivy image scan | `Dockerfile` |
| **CodeQL** | Static code analysis | All pushes/PRs |
| **Dependency Review** | Check for vulnerable/bad license deps | Pull Requests only |

## 🛠️ Local Testing

You can test the workflow locally using `act`:

```bash
# Run the entire workflow
act -W .github/workflows/main.yml

# Run a specific job
act -j backend-ci -W .github/workflows/main.yml
```
