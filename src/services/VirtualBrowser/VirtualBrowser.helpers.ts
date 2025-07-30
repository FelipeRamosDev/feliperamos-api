import fs from 'fs';
import ErrorVirtualBrowser from './ErrorVirtualBrowser';

export async function writeFile(filePath: string, data: Uint8Array): Promise<boolean> {
   try {
      await fs.promises.writeFile(filePath, data);
      return true;
   } catch (error: any) {
      throw new ErrorVirtualBrowser(`Failed to write file at ${filePath}: ${error.message}`, error.code || 'FILE_WRITE_ERROR');
   }
}
