# Subdomain Setup Guide: ui.majin.dev

## Overview
This guide will help you set up `ui.majin.dev` as a subdomain for your UI component documentation, while keeping your main portfolio at `majin.dev`.

## 🚀 Step-by-Step Instructions

### 1. Porkbun DNS Configuration

1. **Log in to Porkbun** (porkbun.com)
2. **Navigate to Domain Management**: Click on `majin.dev`
3. **Add DNS Records**: Click "Edit" next to "DNS Records"

Add the following records:

```
Type: CNAME
Name: ui
Content: unnamed-ui.github.io
TTL: 3600 (or default)
```

```
Type: CNAME
Name: www.ui
Content: unnamed-ui.github.io
TTL: 3600 (or default)
```

### 2. GitHub Repository Settings

1. **Go to your repository**: https://github.com/davidgyongyosi/Unnamed-UI
2. **Settings tab**: Click "Settings" in the repository
3. **Pages section**: Scroll down to "Pages" in the left sidebar
4. **Custom domain**: Under "Custom domain", enter `ui.majin.dev`
5. **Save**: Click "Save"

GitHub will automatically:
- Create a DNS verification file
- Provide you with the required DNS records

### 3. DNS Verification (if needed)

If GitHub shows DNS verification records, add them in Porkbun:

```
Type: TXT
Name: _github-challenge-unnamed-ui
Content: [verification-code-from-github]
TTL: 3600
```

### 4. Enable HTTPS

After DNS propagates (can take 5-30 minutes):

1. **Back in GitHub Pages settings**: Check "Enforce HTTPS"
2. **Wait**: Certificate provisioning can take up to 24 hours

### 5. Verify Everything Works

Check the following URLs once deployed:

- **Primary**: https://ui.majin.dev
- **Storybook**: https://ui.majin.dev/docs-site/
- **API Docs**: https://ui.majin.dev/docs-site/api/
- **With HTTPS**: https://ui.majin.dev (should redirect automatically)

## 📋 Timeline

- **DNS Changes**: 5-30 minutes to propagate
- **GitHub Pages Build**: 2-5 minutes after commit
- **HTTPS Certificate**: Up to 24 hours (usually much faster)
- **Full propagation**: Up to 48 hours globally

## 🔧 Troubleshooting

### If the subdomain doesn't work:
1. **Check DNS**: Use `dig ui.majin.dev` to verify CNAME record
2. **Wait longer**: DNS propagation can take time
3. **Clear cache**: Clear browser DNS cache
4. **Check GitHub Pages**: Ensure the build completed successfully

### If HTTPS doesn't work:
1. **Wait longer**: Certificate provisioning takes time
2. **Check DNS**: Ensure CNAME is correct
3. **Force HTTPS**: Enable "Enforce HTTPS" in GitHub settings

### If build fails:
1. **Check Actions tab**: See workflow error details
2. **Verify CNAME**: Ensure CNAME file exists and is correct
3. **Check permissions**: Ensure repository has Pages permissions

## 🎯 Final Result

Once complete:
- **Main Portfolio**: https://majin.dev (your existing portfolio)
- **UI Documentation**: https://ui.majin.dev (this component library)
- **Professional Setup**: Clean subdomain structure for your projects

## 📝 Notes

- The CNAME file is automatically included in the build process
- All documentation (Storybook + Compodoc) will be available under the subdomain
- No interference with your main portfolio site
- Fully free solution using GitHub Pages and Porkbun DNS