import fs from 'fs';

export async function writeFile(filePath: string, data: Uint8Array): Promise<boolean> {
   try {
      await fs.promises.writeFile(filePath, data);
      return true;
   } catch (error: any) {
      throw new Error(`Failed to write file at ${filePath}: ${error.message}`);
   }
}

export async function deleteFile(filePath: string): Promise<boolean> {
   try {
      await fs.promises.unlink(filePath);
      return true;
   } catch (error: any) {
      throw new Error(`Failed to delete file at ${filePath}: ${error.message}`);
   }
}

export function createDirIfNotExists(dirPath: string): void {
   try {
      const exists = fs.existsSync(dirPath);

      if (!exists) {
         // Create directory if it doesn't exist
         fs.mkdirSync(dirPath, { recursive: true });
      }
   } catch (err: any) {
      throw new Error(`Failed to check or create directory at ${dirPath}: ${err.message}`);
   }
}
