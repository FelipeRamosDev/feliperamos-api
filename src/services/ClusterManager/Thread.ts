import { Worker, isMainThread, workerData } from 'worker_threads';
import InstanceBase from './InstanceBase';
import Core from './Core';
import Cluster from './Cluster';

// Types
import { ThreadSetup } from '../../types/ClusterManager.types';
import { EndpointSetup } from '../../types/EventEndpoint.types';

/**
 * Represents a thread in a multi-threaded environment, extending the capabilities of InstanceBase.
 * Handles thread initialization, route registration, and worker lifecycle management.
 */
class Thread extends InstanceBase {
   public type: string;
   public isThread: boolean;
   public isInit: boolean = false;
   public worker?: Worker;

   /**
    * Constructs a Thread instance, registers routes, and sets thread state.
    * @param setup - The thread configuration object, including routes and initialization flag.
    * @param parent - Optional parent Core or Cluster instance.
    */
   constructor(setup: ThreadSetup = {}, parent?: Core | Cluster) {
      const { routes = [], isInit } = setup || {};
      super(setup, parent);

      this.type = 'thread';
      this.isThread = !isMainThread;
      this.isInit = Boolean(isInit);

      if (this.isThread) {
         routes.map((route: EndpointSetup) => this.setRoute(route));
      }
   }

   /**
    * Initializes the thread, sets the parent, and manages worker creation or data assignment.
    * Registers lifecycle event listeners for the worker.
    * @param parent - Optional parent Core instance.
    * @returns The initialized Thread instance.
    */
   init(parent?: Core): this {
      if (parent) {
         this.setParent(parent);
      }

      if (!this.isThread) {
         this.worker = new Worker(this.filePath, {
            workerData: this.getAllValues(),
         });

         this.worker.on('online', this.callbacks.onReady.bind(this));
         this.worker.on('exit', this.callbacks.onClose.bind(this));
         this.worker.on('error', this.callbacks.onError.bind(this));
         this.worker.on('errormessage', this.callbacks.onError.bind(this));
      } else {
         Object.keys(workerData).forEach((key) => {
            this.setValue(key, workerData[key]);
         });
      }

      this.isInit = true;
      return this;
   }

   /**
    * Gets the thread ID if running as a thread.
    * @returns The thread ID or undefined if not a thread.
    */
   get threadID(): number | undefined {
      return this.isThread ? this.worker?.threadId : undefined;
   }

   /**
    * Terminates the worker thread if running as the main thread and a worker exists.
    */
   terminate(): void {
      if (!this.isThread && this.worker) {
         this.worker.terminate();
      }
   }
}

export default Thread;
