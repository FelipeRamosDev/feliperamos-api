import { CV } from "@/database/models/curriculums_schema";

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

export function cvPdfPath(cv: Partial<CV>): string {
   if (!cv?.user?.name) {
      throw new Error('Invalid CV object');
   }

   const userName = cv.user.name.replace(/ /g, '_');
   return `pdf/cv/${userName}-CV_${cv.language_set}_${cv.id}.pdf`;
}
