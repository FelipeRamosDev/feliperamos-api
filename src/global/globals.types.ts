import ErrorModel from '../models/ErrorModel';
import { AICore, Microservice, SocketServer } from '../services';
import Cluster from '../services/ClusterManager/Cluster';
import Core from '../services/ClusterManager/Core';
import InstanceBase from '../services/ClusterManager/InstanceBase';
import Thread from '../services/ClusterManager/Thread';
import ServerAPI from '../services/ServerAPI/ServerAPI';
import SlackApp from '../services/SlackApp/SlackApp';

declare global {
  var service: ServerAPI | Microservice;
  var aiCore: AICore;
  var socket: SocketServer;
  var thread: Thread;
  var callbacks: Map<string, (...args: any) => any>;
  var instance: Cluster | Core | Thread | InstanceBase;
  var slack: SlackApp;
  var toError: (message: string, name?: string) => ErrorModel;
}
