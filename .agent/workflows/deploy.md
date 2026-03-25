---
description: How to deploy PenRx to production via Vercel
---

# Deploy to Production

PenRx auto-deploys to Vercel on every push to `main`. Follow these steps:

## Prerequisites
- GitHub repo: `lawrencegomez/penrx`
- Vercel project: `penrx` (linked to GitHub)
- Production URL: https://penrx-align-to-grinds-projects.vercel.app

## Steps

1. Make sure the dev server runs without errors
// turbo
```bash
npm run build
```

2. Stage and commit your changes
```bash
git add -A && git status
```

3. Write a descriptive commit message and push
```bash
git commit -m "your commit message here" && git push origin main
```

4. Vercel auto-builds from GitHub. Check deployment status:
// turbo
```bash
cd "/Users/lawrence/Desktop/Peptide Pen App" && vercel ls --prod 2>&1 | head -10
```

5. Wait ~30s for build to complete, then verify the status shows "● Ready"
// turbo
```bash
sleep 30 && cd "/Users/lawrence/Desktop/Peptide Pen App" && vercel ls --prod 2>&1 | head -10
```

6. Open the production URL to verify:
   https://penrx-align-to-grinds-projects.vercel.app

## Troubleshooting

- **Build fails on npm install**: Check `.npmrc` has `legacy-peer-deps=true`
- **Node version mismatch**: Ensure `.node-version` is set to `22.x`
- **Build errors**: Run `npm run build` locally first to catch TypeScript/Vite issues
- **Vercel CLI commands**:
  - `vercel ls --prod` — list production deployments
  - `vercel inspect <url>` — check deployment details
  - `vercel --prod --yes` — manual deploy from CLI
