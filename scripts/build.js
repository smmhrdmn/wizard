#!/usr/bin/env node

/**
 * Wizard Build System
 *
 * Transforms source skills & commands into Claude Code format.
 * Simplified fork of Impeccable's multi-provider build system.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readSourceFiles, readPatterns } from './lib/utils.js';
import { transformClaudeCode } from './lib/transformers/claude-code.js';

/**
 * Copy directory recursively
 */
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Read source files
const { commands, skills } = readSourceFiles(ROOT_DIR);
const patterns = readPatterns(ROOT_DIR);
console.log(`📖 Read ${commands.length} commands, ${skills.length} skills, and ${patterns.patterns.length + patterns.antipatterns.length} pattern categories\n`);

// Transform for Claude Code (unprefixed only)
transformClaudeCode(commands, skills, DIST_DIR, patterns);

// Sync output to project's .claude/ directory
const claudeCodeSrc = path.join(DIST_DIR, 'claude-code', '.claude');
const commandsDest = path.join(ROOT_DIR, '.claude', 'commands');
const skillsDest = path.join(ROOT_DIR, '.claude', 'skills');

if (fs.existsSync(claudeCodeSrc)) {
  const commandsSrc = path.join(claudeCodeSrc, 'commands');
  const skillsSrc = path.join(claudeCodeSrc, 'skills');

  if (fs.existsSync(commandsDest)) fs.rmSync(commandsDest, { recursive: true });
  if (fs.existsSync(skillsDest)) fs.rmSync(skillsDest, { recursive: true });

  if (fs.existsSync(commandsSrc)) copyDirSync(commandsSrc, commandsDest);
  if (fs.existsSync(skillsSrc)) copyDirSync(skillsSrc, skillsDest);

  console.log(`📋 Synced to .claude/: commands + skills`);
}

console.log('\n✨ Build complete!');
