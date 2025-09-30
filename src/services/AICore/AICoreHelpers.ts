import fs from 'fs';
import path from 'path';
import ErrorAICore from './ErrorAICore';

export default class AICoreHelpers {
   static async loadMarkdown(mdPath: string) {
      const absolutePath = path.join(process.cwd(), mdPath);

      if (!fs.existsSync(absolutePath)) {
         throw new ErrorAICore(`Markdown file not found: ${absolutePath}`, 'AICORE_CHAT_MD_NOT_FOUND');
      }

      try {
         const content = await fs.promises.readFile(absolutePath, 'utf-8');
         return content;
      } catch (error) {
         throw new ErrorAICore(`Error reading markdown file: ${error}`, 'AICORE_CHAT_MD_READ_ERROR');
      }
   }

   static async loadBase64String(filePath: string): Promise<string> {
      const absolutePath = path.join(process.cwd(), filePath);

      if (!fs.existsSync(absolutePath)) {
         throw new ErrorAICore(`File not found: ${absolutePath}`, 'AICORE_FILE_NOT_FOUND');
      }

      try {
         const fileData = await fs.promises.readFile(absolutePath, 'base64');
         const mimeType = this.getFileType(absolutePath);

         return `data:${mimeType};base64,${fileData}`;
      } catch (error) {
         throw new ErrorAICore(`Error reading file: ${error}`, 'AICORE_FILE_READ_ERROR');
      }
   }

   static getFileType(filePath: string): string {
      const ext = path.extname(filePath).toLowerCase();

      switch (ext) {
         case '.jpg':
         case '.jpeg':
            return 'image/jpeg';
         case '.png':
            return 'image/png';
         case '.bmp':
            return 'image/bmp';
         case '.webp':
            return 'image/webp';
         case '.gif':
            return 'image/gif';
         case '.tiff':
         case '.tif':
            return 'image/tiff';
         case '.svg':
            return 'image/svg+xml';
         case '.pdf':
            return 'application/pdf';
         case '.txt':
            return 'text/plain';
         case '.doc':
         case '.docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
         case '.xls':
         case '.xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
         case '.ppt':
         case '.pptx':
            return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
         case '.csv':
            return 'text/csv';
         case '.json':
            return 'application/json'; 
         case '.xml':
            return 'application/xml';
         case '.mp3':
            return 'audio/mpeg';
         case '.wav':
            return 'audio/wav';
         case '.mp4':
            return 'video/mp4';
         case '.mov':
            return 'video/quicktime';
         case '.avi':
            return 'video/x-msvideo';
         case '.zip':
            return 'application/zip';
         case '.rar':
            return 'application/vnd.rar';
         case '.7z':
            return 'application/x-7z-compressed';
         case '.gz':
            return 'application/gzip';
         case '.tar':
            return 'application/x-tar';
         case '.md':
            return 'text/markdown';
         case '.html':
         case '.htm':
            return 'text/html';
         case '.css':
         default:
            return 'unknown';
      }
   }
}
