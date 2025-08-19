# WAHA SDK - Automated Publishing Setup Guide

This guide explains how to set up the automated npm publishing pipeline for the WAHA SDK.

## Prerequisites

1. **GitHub Repository**: https://github.com/MajidRaimi/waha-sdk
2. **NPM Account**: You need an npm account to publish packages
3. **GitHub Actions**: Enabled in your repository

## Setup Steps

### 1. NPM Token Setup

1. **Create NPM Access Token**:
   ```bash
   npm login
   npm token create --access public
   ```

2. **Add NPM Token to GitHub Secrets**:
   - Go to your GitHub repository
   - Navigate to `Settings` → `Secrets and variables` → `Actions`
   - Click `New repository secret`
   - Name: `NPM_TOKEN`
   - Value: Your NPM access token

### 2. Branch Strategy

The automated publishing follows this workflow:

```
develop branch (development)
    ↓
    PR to main (review & merge)
    ↓
    Auto-publish to NPM
```

**Branch Rules**:
- `develop` - Main development branch
- `main` - Production/release branch
- Only merges from `develop` → `main` trigger publishing

### 3. Publishing Workflow

When you merge a PR from `develop` to `main`:

1. **Automated Actions**:
   - ✅ Run all tests and linting
   - ✅ Build the project
   - ✅ Bump version automatically
   - ✅ Update CHANGELOG.md
   - ✅ Create Git tag
   - ✅ Publish to NPM
   - ✅ Create GitHub release
   - ✅ Comment on PR with success details

2. **Version Bumping Logic**:
   - **Major**: Breaking changes or "major" label on PR
   - **Minor**: New features or "feat"/"feature" in PR title
   - **Patch**: Bug fixes and other changes (default)

### 4. Manual Release (Optional)

You can also trigger releases manually:

1. Go to `Actions` tab in GitHub
2. Select `Publish to NPM` workflow
3. Click `Run workflow`
4. Choose version bump type (patch/minor/major/prerelease)

## Workflow Files

### 📁 `.github/workflows/publish.yml`
- **Trigger**: PR merged from `develop` to `main`
- **Actions**: Test, build, version bump, publish, release

### 📁 `.github/workflows/ci.yml`
- **Trigger**: All PRs and pushes to `develop`
- **Actions**: Test, lint, build validation

### 📁 `.github/workflows/release-please.yml`
- **Trigger**: Pushes to `main`
- **Actions**: Enhanced release notes

## Usage Instructions

### Development Workflow

1. **Feature Development**:
   ```bash
   git checkout develop
   git checkout -b feature/new-feature
   # Make your changes
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

2. **Create PR to develop**:
   - Create PR: `feature/new-feature` → `develop`
   - Review and merge

3. **Release Preparation**:
   ```bash
   git checkout develop
   git pull origin develop
   # Test everything works
   bun test
   bun run build
   ```

4. **Create Release PR**:
   - Create PR: `develop` → `main`
   - Add appropriate labels:
     - `patch` - Bug fixes
     - `minor` - New features  
     - `major` - Breaking changes
   - Merge PR to trigger automatic publishing

### Version Management

The system automatically determines version bumps:

```typescript
// PR Title/Body Detection:
"feat: new feature"     → Minor bump
"fix: bug fix"          → Patch bump
"BREAKING CHANGE"       → Major bump

// PR Labels:
"major"                 → Major bump
"minor" or "feature"    → Minor bump  
"patch" or default      → Patch bump
```

### Example PR Workflow

1. **Create Feature Branch**:
   ```bash
   git checkout develop
   git checkout -b feat/send-reactions
   ```

2. **Develop Feature**:
   ```typescript
   // Add reaction sending functionality
   await client.messages.setReaction({
     chatId: '123@c.us',
     messageId: 'msg-123',
     reaction: '👍'
   });
   ```

3. **Create PR to develop**:
   ```markdown
   ## Description
   Add support for message reactions
   
   ## Type of Change
   - [x] ✨ New feature
   
   ## Version Impact  
   - [x] **Minor** - New features and enhancements
   ```

4. **Merge to develop** → Test in development

5. **Create Release PR**:
   ```markdown
   ## Description
   Release v1.1.0 with message reactions support
   
   ## Changes
   - ✨ Add message reaction functionality
   - 🐛 Fix typing indicators
   - 📚 Update documentation
   ```

6. **Merge to main** → **Automatic publishing!**

## Monitoring

### Check Publication Status

1. **GitHub Actions**: Monitor workflow runs
2. **NPM**: Check package versions at https://www.npmjs.com/package/waha-sdk
3. **GitHub Releases**: View release notes and downloads

### Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| NPM publish fails | Check NPM_TOKEN secret is valid |
| Tests fail | Fix code issues before merging |
| Version not bumped | Ensure PR is from `develop` to `main` |
| No release created | Check GitHub token permissions |

### Rollback Strategy

If you need to rollback a release:

```bash
# Unpublish from NPM (within 24 hours)
npm unpublish waha-sdk@x.x.x

# Delete GitHub release and tag
git tag -d vx.x.x
git push origin :refs/tags/vx.x.x

# Revert version in package.json
npm version x.x.x --no-git-tag-version
git commit -m "chore: revert to vx.x.x"
git push origin main
```

## Security

- NPM tokens are stored securely in GitHub Secrets
- Publishing only happens on approved merges
- All changes go through PR review process
- Automated testing prevents broken releases

## Support

If you encounter issues with the publishing pipeline:

1. Check GitHub Actions logs
2. Verify NPM token validity
3. Ensure proper branch protection rules
4. Review PR labels and titles

---

**Ready to publish?** Just merge your PR from `develop` to `main` and watch the magic happen! 🚀