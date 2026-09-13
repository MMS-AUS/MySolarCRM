# Deploying Apex Solar CRM / ERP to GitHub & Custom Subdomain

This guide explains how to upload your repository to GitHub and publish the CRM on your custom subdomain (e.g. `crm.yourdomain.com.au` or `erp.yourdomain.com`).

---

## 1. Push Code to GitHub

A clean Git repository on branch `main` has already been initialized with all production configurations.

Run the following commands in your terminal:

```bash
# 1. Link to your GitHub repository (replace with your actual GitHub repo URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git

# 2. Push code to main branch
git push -u origin main
```

---

## 2. Setting Up GitHub Pages for Custom Subdomain

> ⚠️ **CRITICAL (Resolves `HttpError: Not Found` / `Get Pages site failed`):**
> By default, new GitHub repositories have GitHub Pages disabled or set to "Deploy from a branch". If the workflow runs before this is enabled, it will output `HttpError: Not Found`.
>
> To activate it (1-minute step):
> 1. Open your repository on GitHub: `https://github.com/<USERNAME>/<REPO_NAME>`
> 2. Click the **Settings** tab at the top (requires Admin / Owner access to the repo).
> 3. In the left-hand navigation sidebar, click **Pages** (under the "Code and automation" section).
> 4. Under **Build and deployment** -> **Source**: Click the dropdown and select **GitHub Actions**.
> 5. (Optional) Under **Custom domain**:
>    - Enter your custom domain / subdomain (e.g. `crm.yourdomain.com.au`).
>    - Click **Save**.
>    - Check **Enforce HTTPS** once DNS resolves.
> 6. Go to the **Actions** tab and click **"Re-run all jobs"** on the latest workflow run (or simply `git push`). It will now succeed and publish your site!

---

## 3. DNS Configuration at Your Domain Registrar (GoDaddy / Namecheap / Cloudflare / cPanel)

Log in to where your DNS is managed and add the following CNAME record:

| Type  | Name / Host | Value / Target                              | TTL       |
|-------|-------------|---------------------------------------------|-----------|
| CNAME | `crm`       | `<YOUR_GITHUB_USERNAME>.github.io.`        | Automatic |

*(For example, if your GitHub username is `solarexpert`, point `crm` to `solarexpert.github.io`)*

---

## 4. Alternate Deployment Platforms (One-Click)

The codebase also includes native routing files for other modern hosting providers:
- **Cloudflare Pages**: Connect your GitHub repo, Framework preset `Vite`, Build command `npm run build`, Output directory `dist`. Add your custom domain under Custom Domains.
- **Vercel**: `vercel.json` is included with SPA rewrites (`/*` -> `/index.html`).
- **Netlify**: `public/_redirects` is included.
