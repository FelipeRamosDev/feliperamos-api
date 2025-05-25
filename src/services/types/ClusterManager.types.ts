import Thread from '../ClusterManager/Thread';
import { EndpointSetup } from '../../models/types/EventEndpoint.types';

declare global {
   namespace NodeJS {
      interface Process {
         thread: Thread;
      }
   }
}

export interface InstanceBaseSetup {
   id?: string;
   tagName?: string;
   filePath?: string;
   dataStore?: Map<string, any>;
   routes?: EndpointSetup[];
   onReady?: () => void;
   onData?: (data: any) => void;
   onClose?: () => void;
   onError?: (err: any) => void;
}

export interface ThreadSetup extends InstanceBaseSetup {
   filePath?: string;
   isInit?: boolean;
}

export interface CoreSetup extends InstanceBaseSetup {
  worker?: Worker;
  _threads?: Map<string, Thread>;
  threads?: ThreadSetup[];
};

export interface ClusterSetup extends InstanceBaseSetup {
   cores?: CoreSetup[];
}

