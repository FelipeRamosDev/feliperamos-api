import cluster, { Worker } from 'cluster';
import InstanceBase from './InstanceBase';
import Thread from './Thread';
import Cluster from './Cluster';

// Types
import { CoreSetup, ThreadSetup } from '../types/ClusterManager.types';
import { EndpointSetup } from '../../models/types/EventEndpoint.types';

/**
 * Represents a core process managed by InstanceBase, handling threads and worker processes.
 */
class Core extends InstanceBase {
  private _threads: Map<string, Thread>;

  public type: string;
  public worker: Worker | undefined;

  constructor(setup: CoreSetup = {}, parent?: Cluster) {
    const { threads = [], routes = [] } = setup;
    super(setup, parent);

    this._threads = new Map();
    this.type = 'core';
    this.worker = cluster.worker;
  
    if (this.isWorker) {
      routes.map((route: EndpointSetup) => this.setRoute(route));
      if (!this.worker) return;

      threads.map((threadSetup: ThreadSetup) => {
        const thread = new Thread(threadSetup, this);

        thread.init(this);
        this.setThread(thread);
      });

      if (this.worker.isConnected()) {
        this.callbacks.onReady.call(this);
      }

      this.worker.on('exit', this.callbacks.onClose.bind(this));
      this.worker.on('error', this.callbacks.onError.bind(this));
      this.worker.on('errormessage', this.callbacks.onError.bind(this));
    }
  }

  get isWorker(): boolean {
    return cluster.isWorker;
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

  throwError(err: Error): void {
    this.callbacks.onError(err);
  }
}

export default Core;