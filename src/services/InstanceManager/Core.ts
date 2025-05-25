import cluster, { Worker } from 'cluster';
import InstanceBase, { InstanceBaseSetup } from './InstanceBase';
import Thread from './Thread';

export interface CoreSetup extends InstanceBaseSetup {
  worker?: Worker;
  _threads?: Map<string, Thread>;
  threads?: Thread[];
};

/**
 * Represents a core process managed by InstanceBase, handling threads and worker processes.
 */
class Core extends InstanceBase {
  private _threads: Map<string, Thread>;

  public type: string;
  public onlineThreads: number;
  public worker: Worker | undefined;

  constructor(setup: CoreSetup) {
    const { threads = [], routes = [] } = setup || {};
    super(setup);

    this._threads = new Map();
    this.type = 'core';
    this.onlineThreads = 0;
    this.worker = cluster.worker;
  
    if (cluster.isWorker) {
      if (!this.worker) return;

      threads.map((thread: Thread) => {
        thread.init(this);
        this.setThread(thread);
      });

      if (this.worker.isConnected()) {
        this.callbacks.onReady.call(this);
      }

      this.worker.on('exit', this.callbacks.onClose.bind(this));
      this.worker.on('error', this.callbacks.onError.bind(this));
      this.worker.on('errormessage', this.callbacks.onError.bind(this));

      routes.map(route => this.setRoute(route));
    }
  }

  get isWorker(): boolean {
    return cluster.isWorker;
  }

  get corePath(): string {
    return `/${this.tagName}`;
  }

  get coreIndex(): number | undefined {
    return this.isWorker ? cluster.worker?.id : this.worker?.id;
  }

  getThread(threadID: string) {
    return this._threads.get(threadID);
  }

  setThread(thread: Thread) {
    this._threads.set(thread.id, thread);
  }

  getCleanOut(): object {
    return JSON.parse(JSON.stringify({ ...this, parent: undefined }));
  }

  throwError(err: Error): void {
    this.callbacks.onError(err);
  }

  logError(err: any): Error {
    return err instanceof Error ? err : new Error(String(err));
  }
}

export default Core;