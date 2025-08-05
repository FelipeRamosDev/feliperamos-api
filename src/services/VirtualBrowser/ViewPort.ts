import { ViewPortSetup } from './VirtualBrowser.types';

class ViewPort {
   private _width: number;
   private _height: number;

   constructor(setup?: ViewPortSetup) {
      const { width = 1440, height = 900 } = setup || {};

      this._width = width;
      this._height = height;
   }

   get width(): number {
      return this._width;
   }
   get height(): number {
      return this._height;
   }
}

export default ViewPort;
