import { Page, PDFOptions } from 'puppeteer';
import ErrorVirtualBrowser from './ErrorVirtualBrowser';
import VirtualBrowser from './VirtualBrowser';
import { createDirIfNotExists, writeFile } from '../../helpers/fs.helpers';
import type { VirtualBrowserPageSetup } from './VirtualBrowser.types';

class VirtualBrowserPage {
   public id: string;
   public startURL?: string;

   private _page: Page | null;
   private _browser: () => VirtualBrowser;

   constructor(setup: VirtualBrowserPageSetup, virtualBrowser: VirtualBrowser) {
      const { id, startURL } = setup || {};
      
      if (!virtualBrowser) {
         throw new ErrorVirtualBrowser('Virtual Browser instance is required', 'VIRTUAL_BROWSER_REQUIRED');
      }

      if (!id) {
         throw new ErrorVirtualBrowser('Page ID is required', 'PAGE_ID_REQUIRED');
      }

      this._browser = () => virtualBrowser;
      this._page = null;

      this.id = id;
      this.startURL = startURL;
   }

   get virtualBrowser(): VirtualBrowser {
      return this._browser();
   }

   async open(): Promise<VirtualBrowserPage> {
      if (!this.virtualBrowser.browser) {
         throw new ErrorVirtualBrowser('Browser not initialized', 'BROWSER_NOT_INITIALIZED');
      }

      try {
         this._page = await this.virtualBrowser.browser.newPage();

         if (!this._page) {
            throw new ErrorVirtualBrowser('Failed to create a new page', 'PAGE_CREATION_ERROR');
         }

         if (this.startURL) {
            await this._page.goto(this.startURL, { waitUntil: 'domcontentloaded' });
         }

         await this._page.setViewport(this.virtualBrowser.viewPort);
         return this;
      } catch (error: any) {
         throw new ErrorVirtualBrowser(error.message, error.code || 'PAGE_OPEN_ERROR');
      }
   }

   async navigate(url: string): Promise<void> {
      if (!this._page) {
         throw new ErrorVirtualBrowser('Page not initialized', 'PAGE_NOT_INITIALIZED');
      }

      if (!url) {
         throw new ErrorVirtualBrowser('URL is required for navigation', 'URL_REQUIRED');
      }

      try {
         await this._page.goto(url);
      } catch (error: any) {
         throw new ErrorVirtualBrowser(error.message, error.code || 'PAGE_NAVIGATION_ERROR');
      }
   }

   async toPDF(filePath: string, options?: PDFOptions): Promise<Uint8Array> {
      if (!this._page) {
         throw new ErrorVirtualBrowser('Page not initialized', 'PAGE_NOT_INITIALIZED');
      }

      if (!filePath) {
         throw new ErrorVirtualBrowser('File path is required for PDF generation', 'FILE_PATH_REQUIRED');
      }

      try {
         const pdfBuffer = await this._page.pdf({
            path: filePath,
            format: 'A4',
            ...options
         });

         if (!pdfBuffer) {
            throw new ErrorVirtualBrowser('Failed to generate PDF', 'PDF_GENERATION_ERROR');
         }

         const writeResult = await writeFile(filePath, pdfBuffer);
         if (!writeResult) {
            throw new ErrorVirtualBrowser('Failed to write PDF file', 'PDF_WRITE_ERROR');
         }

         console.log(`PDF saved to ${filePath} successfully. Size: ${pdfBuffer.length} bytes`);
         return pdfBuffer;
      } catch (error: any) {
         console.error(`Error generating PDF: ${error.message}`);
         throw new ErrorVirtualBrowser(error.message, error.code || 'PDF_GENERATION_ERROR');
      }
   }

   async close(): Promise<void> {
      if (!this._page) {
         throw new ErrorVirtualBrowser('Page not initialized', 'PAGE_NOT_INITIALIZED');
      }

      try {
         await this._page.close();
         this.virtualBrowser.deletePage(this.id);
         this._page = null;
      } catch (error: any) {
         throw new ErrorVirtualBrowser(error.message, error.code || 'PAGE_CLOSE_ERROR');
      }
   }
}

export default VirtualBrowserPage;
