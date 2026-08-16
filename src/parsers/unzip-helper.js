import * as fflate from 'fflate';

/**
 * Extracts files from a ZIP archive in browser memory without crashing the tab
 * @param {File} zipFile 
 * @returns {Promise<Array<{name: string, content: string}>>}
 */
export async function unzipArchive(zipFile) {
  const arrayBuffer = await zipFile.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  return new Promise((resolve, reject) => {
    fflate.unzip(uint8Array, (err, unzipped) => {
      if (err) {
        return reject(err);
      }
      
      const files = [];
      const decoder = new TextDecoder('utf-8');
      
      for (const [filename, fileData] of Object.entries(unzipped)) {
        // Skip hidden files, system files, and directory indicators
        if (filename.startsWith('__MACOSX') || filename.endsWith('/') || filename.includes('.DS_Store')) {
          continue;
        }
        
        // Only decode text files (.json, .csv, .html)
        if (filename.endsWith('.json') || filename.endsWith('.csv') || filename.endsWith('.html') || filename.endsWith('.txt')) {
          try {
            const text = decoder.decode(fileData);
            files.push({
              name: filename,
              content: text
            });
          } catch (e) {
            console.warn(`Could not decode ${filename}:`, e);
          }
        }
      }
      
      resolve(files);
    });
  });
}
