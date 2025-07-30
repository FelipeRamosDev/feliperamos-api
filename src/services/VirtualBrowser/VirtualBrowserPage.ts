import { Page } from 'puppeteer';
import ErrorVirtualBrowser from './ErrorVirtualBrowser';
import VirtualBrowser from './VirtualBrowser';
import { VirtualBrowserPageSetup } from './VirtualBrowser.types';

class VirtualBrowserPage {
   public id: string;
   public startURL?: string;

   private _page: Page | null;
   private _browser: () => VirtualBrowser;

   constructor(setup: VirtualBrowserPageSetup, virtualBrowser: VirtualBrowser) {
      const { id, startURL } = setup || {};
      
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

   get page(): Page | null {
      return this._page;
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
            await this._page.goto(this.startURL);
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

   async close(): Promise<void> {
      if (!this._page) {
         throw new ErrorVirtualBrowser('Page not initialized', 'PAGE_NOT_INITIALIZED');
      }

      try {
         await this._page.close();
      } catch (error: any) {
         throw new ErrorVirtualBrowser(error.message, error.code || 'PAGE_CLOSE_ERROR');
      }
   }
}

export default VirtualBrowserPage;
