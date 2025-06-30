import cluster, { Worker } from 'cluster';
import InstanceBase from './InstanceBase';
import Thread from './Thread';
import Cluster from './Cluster';

// Types
import { CoreSetup, ThreadSetup } from './types/ClusterManager.types';
import { EndpointSetup } from './types/EventEndpoint.types';

/**
 * Represents a core process managed by InstanceBase, handling threads and worker processes.
 * Each core can manage multiple threads and is associated with a worker in the Node.js cluster.
 */
class Core extends InstanceBase {
  private _threads: Map<string, Thread>;

  public type: string;
  public worker: Worker | undefined;

  /**
   * Constructs a Core instance, initializes threads and routes, and sets up worker event listeners.
   * @param setup - The core configuration object, including threads and routes.
   * @param parent - Optional parent Cluster instance.
   */
  constructor(setup: CoreSetup = {}, parent?: Cluster) {
    const { threads = [], routes = [] } = setup;
    super(setup, parent);

    this._threads = new Map();
    this.type = 'core';
    this.worker = cluster.worker;
  
    if (this.isWorker) {
      // Register routes for this core
      routes.map((route: EndpointSetup) => this.setRoute(route));
      if (!this.worker) return;

      // Initialize and register threads for this core
      threads.map((threadSetup: ThreadSetup) => {
        const thread = new Thread(threadSetup, this);

        thread.init(this);
        this.setThread(thread);
      });

      // Trigger onReady callback if worker is connected
      if (this.worker.isConnected()) {
        this.callbacks.onReady.call(this);
      }

      // Register worker event listeners
      this.worker.on('exit', this.callbacks.onClose.bind(this));
      this.worker.on('error', this.callbacks.onError.bind(this));
      this.worker.on('errormessage', this.callbacks.onError.bind(this));
    }
  }

  /**
   * Returns true if the current process is a worker process.
   */
  get isWorker(): boolean {
    return cluster.isWorker;
  }

  /**
   * Returns the index (ID) of the core in the cluster.
   * @returns The worker ID if in a worker process, otherwise the worker's ID if available.
   */
  get coreIndex(): number | undefined {
    return this.isWorker ? cluster.worker?.id : this.worker?.id;
  }

  /**
   * Retrieves a Thread instance by its thread ID.
   * @param threadID - The ID of the thread to retrieve.
   * @returns The Thread instance or undefined if not found.
   */
  getThread(threadID: string): Thread | undefined {
    return this._threads.get(threadID);
  }

  /**
   * Stores a Thread instance in the internal threads map.
   * @param thread - The Thread instance to store.
   */
  setThread(thread: Thread) {
    this._threads.set(thread.id, thread);
  }

  /**
   * Triggers the onError callback with the provided error.
   * @param err - The error to handle.
   */
  throwError(err: Error): void {
    this.callbacks.onError(err);
  }
}

export default Core;
