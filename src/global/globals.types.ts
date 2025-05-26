import ErrorModel from '../models/ErrorModel';
import AI from '../services/AI';
import Cluster from '../services/ClusterManager/Cluster';
import Core from '../services/ClusterManager/Core';
import InstanceBase from '../services/ClusterManager/InstanceBase';
import Thread from '../services/ClusterManager/Thread';
import SlackApp from '../services/SlackApp';

declare global {
  var ai: AI;
  var thread: Thread;
  var callbacks: Map<string, (...args: any) => any>;
  var instance: Cluster | Core | Thread | InstanceBase;
  var slack: SlackApp;
  var toError: (message: string, name?: string) => ErrorModel;
}
