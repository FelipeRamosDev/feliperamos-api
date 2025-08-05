import { StaticFolderSetup } from './ServerAPI.types';
import path from 'path';

class StaticFolder {
   private _publicRoot: string;

   public path: string;
   public alias: string;

   constructor(setup: StaticFolderSetup) {
      const { publicRoot, path: folderPath = '/', alias } = setup;

      if (!publicRoot) {
         throw new Error('StaticFolder requires a publicRoot to be set.');
      }

      this._publicRoot = publicRoot;
      this.path = path.join(this._publicRoot, folderPath);
      this.alias = this.buildStaticAlias(alias);
   }

   buildStaticAlias(alias?: string): string {
      return `/${(alias || this.path).split('/').filter(Boolean).join('/')}`;
   }
}

export default StaticFolder;
