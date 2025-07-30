import puppeteer, { Browser } from 'puppeteer';
import ErrorVirtualBrowser from './ErrorVirtualBrowser';
import ViewPort from './ViewPort';
import VirtualBrowserPage from './VirtualBrowserPage';
import type { VirtualBrowserSetup } from './VirtualBrowser.types';

class VirtualBrowser {
   private _viewPort: ViewPort;
   private _browser: Browser | null;

   public pages: Map<string, VirtualBrowserPage>;

   constructor(setup?: VirtualBrowserSetup) {
      const { viewPort } = setup || {};

      this._browser = null;
      this._viewPort = new ViewPort(viewPort);

      this.pages = new Map();
   }

   get browser(): Browser | null {
      return this._browser;
   }

   get viewPort(): ViewPort {
      return this._viewPort;
   }

   async init() {
      try {
         this._browser = await puppeteer.launch();
      } catch (error: any) {
         throw new ErrorVirtualBrowser(error.message, error.code || 'VIRTUAL_BROWSER_LAUNCH_ERROR');
      }
   }

   async newPage(id: string, startURL?: string): Promise<VirtualBrowserPage> {
      if (!this._browser) {
         throw new ErrorVirtualBrowser('Browser not initialized', 'BROWSER_NOT_INITIALIZED');
      }

      if (!id) {
         throw new ErrorVirtualBrowser('Page ID is required', 'PAGE_ID_REQUIRED');
      }

      try {
         const page = new VirtualBrowserPage({ id, startURL }, this);

         this.setPage(id, page);
         return await page.open();
      } catch (error: any) {
         throw new ErrorVirtualBrowser(error.message, error.code || 'PAGE_CREATION_ERROR');
      }
   }

   setPage(pageId: string, page: VirtualBrowserPage): void {
      if (!this.pages.has(pageId)) {
         this.pages.set(pageId, page);
      } else {
         throw new ErrorVirtualBrowser(`Page with ID ${pageId} already exists`, 'PAGE_ALREADY_EXISTS');
      }
   }

   getPage(pageId: string): VirtualBrowserPage | undefined {
      return this.pages.get(pageId);
   }
}

export default VirtualBrowser;
