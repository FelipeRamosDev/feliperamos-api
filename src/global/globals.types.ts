import ErrorModel from '../models/ErrorModel';
import AI from '../services/AI';
import Cluster from '../services/ClusterManager/Cluster';
import Core from '../services/ClusterManager/Core';
import InstanceBase from '../services/ClusterManager/InstanceBase';
import Thread from '../services/ClusterManager/Thread';

declare global {
  var ai: AI;
  var thread: Thread;
  var callbacks: Map<string, (...args: any) => any>;
  var instance: Cluster | Core | Thread | InstanceBase;
  var toError: (message: string, name?: string) => ErrorModel;
}
