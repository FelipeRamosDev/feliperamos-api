import cluster from 'cluster';
import os from 'os';
import InstanceBase from './InstanceBase';
import Core from './Core';

// Types
import { ClusterSetup, CoreSetup } from './types/ClusterManager.types';

/**
 * Represents a cluster of Node.js processes managed by the InstanceBase.
 * Handles the creation, management, and communication of multiple core processes (workers).
 * Provides methods to access and manage cluster state and core instances.
 */
class Cluster extends InstanceBase {
   private _cores: Map<string, Core>;

   public type: string;
   public onlineCores: number;

   /**
    * Constructs a Cluster instance and initializes the cluster with the provided setup.
    * Forks worker processes for each core configuration and sets up event listeners for cluster lifecycle events.
    * @param setup - The cluster configuration object, including cores and routes.
    */
   constructor(setup: ClusterSetup) {
      super(setup);
      const { cores = [], routes = [] } = setup;

      this._cores = new Map();
      this.type = 'cluster';
      this.onlineCores = 0;

      try {
         const maxCPUs = os.cpus().length;

         // If no cores are provided, immediately call the onReady callback.
         if (!cores.length) {
            this.callbacks.onReady.call(this);
            return;
         }

         // Master process: fork workers for each core and set up event listeners.
         if (this.isMaster) {
            cores.map((coreConfig, coreIndex) => {
               if (coreIndex >= maxCPUs) {
                  throw new Error('Maximum CPUs number exceeded!');
               }

               // Fork a new worker process with the coreID as an environment variable.
               cluster.fork({ coreID: String(coreConfig.tagName) });
               const core = new Core(coreConfig as CoreSetup);
               this.setCore(core);
            });

            // Listen for worker online events and trigger onReady when all are online.
            cluster.on('online', () => {
               this.onlineCores++;

               if (this.onlineCores === cores.length) {
                  this.callbacks.onReady.call(this);
               }
            });

            // Listen for cluster errors and call the onError callback.
            cluster.on('error', (err) => {
               this.callbacks.onError.call(this, new Error(err));
            });

            // Register provided routes.
            routes.map(route => this.setRoute(route));
         } else {
            // Worker process: find and initialize the core configuration for this worker.
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

   /**
    * Returns true if the current process is the cluster's primary (master) process.
    */
   get isMaster(): boolean {
      return cluster.isPrimary;
   }

   /**
    * Returns true if the current process is a worker process.
    */
   get isWorker(): boolean {
      return cluster.isWorker;
   }

   /**
    * Returns the worker ID if in a worker process, otherwise undefined.
    */
   get workerID(): number | undefined {
      return cluster.worker?.id;
   }

   /**
    * Retrieves a Core instance by its tag name.
    * Only available in the master process.
    * @param tagName - The tag name of the core.
    * @returns The Core instance or undefined if not found.
    */
   getCore(tagName: string): Core | undefined {
      if (!tagName) return;

      if (this.isMaster) {
         return this._cores.get(tagName);
      }

      return;
   }

   /**
    * Stores a Core instance in the internal cores map.
    * @param core - The Core instance to store.
    */
   setCore(core: Core): void {
      this._cores.set(core.id, core);
   }
}

export default Cluster;
