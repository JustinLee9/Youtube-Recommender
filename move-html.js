import { promises as fs } from 'fs';

async function moveHtmlFiles() {
  const mappings = [
    { from: 'dist/src/popup/popup.html', to: 'dist/popup.html' },
  ];

  for (const { from, to } of mappings) {
    try {
      await fs.rename(from, to);
      console.log(`Moved ${from} -> ${to}`);
    } catch (err) {
      console.error(`Failed to move ${from} -> ${to}:`, err);
    }
  }

  // After moving files, delete the dist/src folder
  try {
    await fs.rmdir('dist/src', { recursive: true });
    console.log('Deleted dist/src/ folder.');
  } catch (err) {
    console.error('Failed to delete dist/src/:', err);
  }

  console.log('Finished moving HTML files and cleaning up.');
}

moveHtmlFiles();
