import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import InstanceBase, { InstanceBaseSetup } from './InstanceBase';
import Core from './Core';


/**
 * Represents a thread in a multi-threaded environment, extending the capabilities of InstanceBase.
 */
class Thread extends InstanceBase {
   public type: string;
   public isThread: boolean;
   public isInit: boolean = false;
   public worker?: Worker;

   constructor(setup: InstanceBaseSetup) {
      const { routes = [] } = setup || {};
      super(setup);

      this.type = 'thread';
      this.isThread = !isMainThread;

      if (this.isThread) {
         routes.map(route => this.setRoute(route));
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

   get parentCore(): any {
      return this.getValue('parentCore');
   }

   clone(): Thread {
      return new Thread(Object(this));
   }

   getCleanOut(): object {
      return JSON.parse(
         JSON.stringify({
            ...this,
            parent: undefined,
         })
      );
   }

   restart(): void {
      if (!this.isThread) {
         this.terminate();
      }
   }

   terminate(): void {
      if (!this.isThread && this.worker) {
         this.worker.terminate();
      }
   }
}

export default Thread;
