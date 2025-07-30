export interface VirtualBrowserSetup {
   viewPort?: ViewPortSetup;
}

export interface ViewPortSetup {
   width: number;
   height: number;
}

export interface VirtualBrowserPageSetup {
   id: string;
   startURL?: string;
}
