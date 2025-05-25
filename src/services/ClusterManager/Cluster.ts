import cluster from 'cluster';
import os from 'os';
import InstanceBase from './InstanceBase';
import Core from './Core';

// Types
import { ClusterSetup, CoreSetup } from '../types/ClusterManager.types';

/**
 * Represents a cluster of Node.js processes managed by the InstanceBase.
 */
class Cluster extends InstanceBase {
   private _cores: Map<string, Core>;

   public type: string;
   public onlineCores: number;

   constructor(setup: ClusterSetup) {
      super(setup);
      const { cores = [], routes = [] } = setup;

      this._cores = new Map();
      this.type = 'cluster';
      this.onlineCores = 0;

      try {
         const maxCPUs = os.cpus().length;

         if (!cores.length) {
            this.callbacks.onReady.call(this);
            return;
         }

         if (this.isMaster) {
            cores.map((coreConfig, coreIndex) => {
               if (coreIndex >= maxCPUs) {
                  throw new Error('Maximum CPUs number exceeded!');
               }

               cluster.fork({ coreID: String(coreConfig.tagName) });
               const core = new Core(coreConfig as CoreSetup);
               this.setCore(core);
            });

            cluster.on('online', () => {
               this.onlineCores++;

               if (this.onlineCores === cores.length) {
                  this.callbacks.onReady.call(this);
               }
            });

            cluster.on('error', (err) => {
               this.callbacks.onError.call(this, new Error(err));
            });

            routes.map(route => this.setRoute(route));
         } else {
            const coreID = process.env.coreID;
            const coreConfig = cores.find(core => core.tagName === coreID);

            if (coreConfig) {
               const core = new Core(coreConfig as CoreSetup);
               this.setCore(core);
            }
         }
      } catch (err) {
         if (this.isMaster) {
            this.callbacks.onError.call(this, err);
         }
      }
   }

   get isMaster(): boolean {
      return cluster.isPrimary;
   }

   get isWorker(): boolean {
      return cluster.isWorker;
   }

   get workerID(): number | undefined {
      return cluster.worker?.id;
   }

   getCore(tagName: string): Core | undefined {
      if (!tagName) return;

      if (this.isMaster) {
         return this._cores.get(tagName);
      }
   }

   setCore(core: Core): void {
      this._cores.set(core.id, core);
   }
}

export default Cluster;
