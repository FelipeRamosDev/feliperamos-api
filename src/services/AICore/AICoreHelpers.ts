import fs from 'fs';
import path from 'path';
import ErrorAICore from './ErrorAICore';

export default class AICoreHelpers {
   static loadMarkdown(mdPath: string) {
      const absolutePath = path.join(process.cwd(), mdPath);

      if (!fs.existsSync(absolutePath)) {
         throw new ErrorAICore(`Markdown file not found: ${absolutePath}`, 'AICORE_CHAT_MD_NOT_FOUND');
      }

      const content = fs.readFileSync(absolutePath, 'utf-8');
      return content;
   }
}
