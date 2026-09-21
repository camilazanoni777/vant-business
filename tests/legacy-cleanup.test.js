import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const readmeSource = readFileSync(new URL('../README.md', import.meta.url), 'utf8');

const legacyPublicFiles = [
  '../src/pages/BlogPage.jsx',
  '../src/pages/BlogPostPage.jsx',
  '../src/pages/EbookPage.jsx',
  '../src/pages/CasesPage.jsx',
  '../src/components/EbookCover.jsx',
  '../src/components/NewsletterSignup.jsx',
  '../src/components/RecruiterMode.jsx',
  '../src/components/ResumeSection.jsx',
  '../src/components/ProjectsSection.jsx',
  '../src/components/ProjectCard.jsx',
  '../src/components/ContactSection.jsx',
  '../src/data/projects.js',
  '../src/data/roles.js',
  '../src/utils/posts.js',
  '../src/pages/AdminPage.jsx',
  '../src/components/AdminOverviewScreen.jsx',
  '../src/components/AgentSyncPanel.jsx',
  '../src/components/Hero.jsx',
  '../src/components/ProjectModal.jsx',
  '../src/components/SkillsSection.jsx',
  '../src/components/SocialLinks.jsx',
  '../src/data/experiences.js',
  '../src/data/skills.js',
  '../public/curriculo-victor-hugo.pdf',
];

test('inactive public legacy modules are removed from the current VANT app', () => {
  for (const relativePath of legacyPublicFiles) {
    assert.equal(
      existsSync(new URL(relativePath, import.meta.url)),
      false,
      `${relativePath} should live only in the archive branch`
    );
  }
});

test('current app does not expose blog or ebook routes', () => {
  assert.doesNotMatch(appSource, /BlogPage|BlogPostPage|EbookPage/);
  assert.doesNotMatch(appSource, /path="\/blog/);
  assert.doesNotMatch(appSource, /path="\/ebook\/:slug"/);
});

test('README does not document inactive public legacy routes as current modules', () => {
  assert.doesNotMatch(readmeSource, /\/ebook\/:slug/);
  assert.doesNotMatch(readmeSource, /BlogPage/);
  assert.doesNotMatch(readmeSource, /BlogPostPage/);
});
