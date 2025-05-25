import { Worker, isMainThread, workerData } from 'worker_threads';
import InstanceBase from './InstanceBase';
import Core from './Core';
import Cluster from './Cluster';

// Types
import { ThreadSetup } from '../../types/ClusterManager.types';
import { EndpointSetup } from '../../types/EventEndpoint.types';

/**
 * Represents a thread in a multi-threaded environment, extending the capabilities of InstanceBase.
 */
class Thread extends InstanceBase {
   public type: string;
   public isThread: boolean;
   public isInit: boolean = false;
   public worker?: Worker;

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

   get threadID(): number | undefined {
      return this.isThread ? this.worker?.threadId : undefined;
   }

   terminate(): void {
      if (!this.isThread && this.worker) {
         this.worker.terminate();
      }
   }
}

export default Thread;
