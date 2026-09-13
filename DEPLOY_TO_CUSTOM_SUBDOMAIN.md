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

1. Open your repository on GitHub: `https://github.com/<USERNAME>/<REPO_NAME>`
2. Go to **Settings** > **Pages**
3. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (the included `.github/workflows/deploy.yml` will automatically build Vite and deploy the `dist/` directory on every push).
4. Under **Custom domain**:
   - Enter your subdomain: `crm.yourdomain.com.au` (or your chosen subdomain).
   - Click **Save**.
   - Check **Enforce HTTPS** (once DNS finishes verifying, GitHub provisions a free Let's Encrypt SSL certificate).

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
