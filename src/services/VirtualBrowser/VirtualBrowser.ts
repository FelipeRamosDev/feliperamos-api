import puppeteer, { Browser } from 'puppeteer';
import ErrorVirtualBrowser from './ErrorVirtualBrowser';
import ViewPort from './ViewPort';
import VirtualBrowserPage from './VirtualBrowserPage';
import type { VirtualBrowserSetup } from './VirtualBrowser.types';
import Microservice from '../Microservice/Microservice';

class VirtualBrowser extends Microservice {
   private _viewPort: ViewPort;
   private _browser: Browser | null;
   private _onInit: (virtualBrowser: VirtualBrowser) => void;
   private _onError: (error: ErrorVirtualBrowser) => void;

   public pages: Map<string, VirtualBrowserPage>;

   constructor(setup: VirtualBrowserSetup = {}) {
      super(setup);
      const { viewPort, autoInit, onInit = () => {}, onError = () => {} } = setup;

      this._browser = null;
      this._viewPort = new ViewPort(viewPort);
      this._onInit = onInit;
      this._onError = onError;

      this.pages = new Map();

      if (autoInit) {
         this.init().then((vb) => {
            this._onInit(vb);
         }).catch((error) => {
            this._onError(error);
         });
      }
   }

   get browser(): Browser {
      if (!this._browser) {
         throw new ErrorVirtualBrowser('Browser not initialized', 'BROWSER_NOT_INITIALIZED');
      }

      return this._browser;
   }

   get viewPort(): ViewPort {
      return this._viewPort;
   }

   async init(): Promise<VirtualBrowser> {
      try {
         this._browser = await puppeteer.launch();
         return this;
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

   deletePage(pageId: string): void {
      if (!pageId) {
         throw new ErrorVirtualBrowser('Page ID is required to delete a page', 'PAGE_ID_REQUIRED');
      }

      if (!this.pages.has(pageId)) {
         return;
      }

      this.pages.delete(pageId);
   }

   async closePage(pageId: string): Promise<void> {
      const page = this.getPage(pageId);

      if (!page) {
         throw new ErrorVirtualBrowser(`Page with ID ${pageId} does not exist`, 'PAGE_NOT_FOUND');
      }

      try {
         await page.close();
         this.deletePage(pageId);
      } catch (error: any) {
         throw new ErrorVirtualBrowser(error.message, error.code || 'PAGE_CLOSE_ERROR');
      }
   }

   async close(): Promise<void> {
      if (!this._browser) {
         throw new ErrorVirtualBrowser('Browser not initialized', 'BROWSER_NOT_INITIALIZED');
      }

      try {
         await this._browser.close();
         this._browser = null;
         this.pages.clear();
      } catch (error: any) {
         throw new ErrorVirtualBrowser(error.message, error.code || 'BROWSER_CLOSE_ERROR');
      }
   }
}

export default VirtualBrowser;
