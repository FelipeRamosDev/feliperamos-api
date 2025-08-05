import path from "path";

export function frontendURL(path: string, queryParams: Record<string, string | number | boolean> = {}): string {
   const url = new URL(process.env.FRONTEND_URL || 'http://localhost:3000');

   if (typeof path !== 'string') {
      throw new Error('Path must be a string');
   }

   Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
   });

   url.pathname = path;
   return url.toString();
}

export function cvPdfPath(userFullName: string, cvId: number, languageSet: string): string {
   if (!userFullName) {
      throw new Error('Invalid userFullName provided');
   }

   if (!cvId || typeof cvId !== 'number') {
      throw new Error('Invalid cvId provided');
   }

   if (!languageSet || typeof languageSet !== 'string') {
      throw new Error('Invalid languageSet provided');
   }

   const userName = userFullName.replace(/ /g, '_');

   const relativePath = `cv/${userName}-CV_${cvId}_${languageSet}.pdf`;
   return path.join(process.env.PUBLIC_PATH || '', relativePath);
}
