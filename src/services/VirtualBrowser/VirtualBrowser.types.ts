import ErrorVirtualBrowser from './ErrorVirtualBrowser';
import VirtualBrowser from './VirtualBrowser';

export interface VirtualBrowserSetup {
   viewPort?: ViewPortSetup;
   autoInit?: boolean;
   onInit?: (virtualBrowser: VirtualBrowser) => void;
   onError?: (error: ErrorVirtualBrowser) => void;
}

export interface ViewPortSetup {
   width: number;
   height: number;
}

export interface VirtualBrowserPageSetup {
   id: string;
   startURL?: string;
}

export interface VirtualBrowserSuccessResponse<T> {
   success: true;
   data: T;
}
