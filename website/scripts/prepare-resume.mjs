import { createHash } from 'node:crypto';
import { readFile, mkdir, copyFile } from 'node:fs/promises';

const root = new URL('../../', import.meta.url);
const hash = createHash('sha256');
for (const path of ['resume.md', 'scripts/build_resume_pdf.py', 'assets/resume.pdf']) {
  hash.update(await readFile(new URL(path, root)));
}
const expected = (await readFile(new URL('scripts/resume-pdf.sha256', root), 'utf8')).trim();
if (hash.digest('hex') !== expected) {
  throw new Error('Resume PDF is stale. Run python3 scripts/build_resume_pdf.py and commit the PDF and scripts/resume-pdf.sha256.');
}
if (!process.argv.includes('--check')) {
  const destination = new URL('../public/assets/', import.meta.url);
  await mkdir(destination, { recursive: true });
  await copyFile(new URL('assets/resume.pdf', root), new URL('resume.pdf', destination));
}
console.log('Resume PDF matches its source and renderer.');
