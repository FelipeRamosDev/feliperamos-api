import { EventEndpoint } from '../../services';

export interface MicroserviceSetup {
   id?: string | undefined;
   containerName?: string | undefined;
   endpoints?: EventEndpoint[] | undefined;
   onServiceReady?: (() => void) | undefined;
   onError?: ((error: any) => void) | undefined;
}
