import fs from 'fs';
import path from 'path';
import ErrorVirtualBrowser from './ErrorVirtualBrowser';

export async function writeFile(filePath: string, data: Uint8Array): Promise<boolean> {
   try {
      const dir = path.dirname(filePath);
      await fs.promises.mkdir(dir, { recursive: true });

      await fs.promises.writeFile(filePath, data);
      return true;
   } catch (error: any) {
      throw new ErrorVirtualBrowser(`Failed to write file at ${filePath}: ${error.message}`, error.code || 'FILE_WRITE_ERROR');
   }
}

export async function deleteFile(filePath: string): Promise<boolean> {
   try {
      await fs.promises.unlink(filePath);
      return true;
   } catch (error: any) {
      throw new ErrorVirtualBrowser(`Failed to delete file at ${filePath}: ${error.message}`, error.code || 'FILE_DELETE_ERROR');
   }
}
