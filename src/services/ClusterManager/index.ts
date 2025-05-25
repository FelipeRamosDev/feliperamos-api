import Cluster from './Cluster';
import Core from './Core';
import Thread from './Thread';
import InstanceBase from './InstanceBase';

/**
 * Exports the classes related to a multi-threaded environment, providing the necessary components to build and manage a cluster of cores and threads.
 */
class ClusterManager {
   /**
    * Manages a cluster of cores and threads.
    */
   static Cluster = Cluster;

   /**
    * Represents the core unit in the cluster, managing threads and routing messages.
    */
   static Core = Core;

   /**
    * Represents a thread, handling message passing and thread-specific logic.
    */
   static Thread = Thread;

   /**
    * Serves as the base class for instances, providing common functionality.
    */
   static InstanceBase = InstanceBase;
}

export default ClusterManager;
