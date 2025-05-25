import cluster from 'cluster';
import os from 'os';
import InstanceBase, { InstanceBaseSetup } from './InstanceBase';
import Core, { CoreSetup } from './Core';

declare global {
   // Extend the NodeJS.Process interface to include 'cluster'
   namespace NodeJS {
      interface Process {
         cluster?: Cluster;
      }
   }
}

export interface ClusterSetup extends InstanceBaseSetup {
   cores?: CoreSetup[];
}

/**
 * Represents a cluster of Node.js processes managed by the InstanceBase.
 */
class Cluster extends InstanceBase {
   private _cores: Map<string, Core>;
   public onlineCores = 0;

   constructor(setup: ClusterSetup) {
      super(setup);
      const { cores = [], routes = [] } = setup;

      this._cores = new Map();
      process.cluster = this;

      try {
         const maxCPUs = os.cpus().length;
         if (this.isMaster) {
            cores.map((coreConfig, coreIndex) => {
               if (coreIndex >= maxCPUs) {
                  throw new Error('Maximum CPUs number exceeded!');
               }

               cluster.fork({ coreID: String(coreConfig.tagName) });
               const core = new Core(coreConfig);
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
               const core = new Core(coreConfig);
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
