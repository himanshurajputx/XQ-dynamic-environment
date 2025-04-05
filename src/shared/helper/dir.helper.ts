import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';

export function ensureDirectoryExists(dirPath: string) {
  const fullPath = path.resolve(dirPath);

  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Directory created at: ${fullPath}`);
    return fullPath;
  } else {
    console.log(`📁 Directory already exists at: ${fullPath}`);
    return fullPath;
  }
}
