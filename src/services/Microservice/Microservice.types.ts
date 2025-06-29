import EventEndpoint from "../../models/EventEndpoint";

export interface MicroserviceSetup {
   id?: string | undefined;
   containerName?: string | undefined;
   endpoints?: EventEndpoint[] | undefined;
   onReady?: (() => void) | undefined;
   onError?: ((error: Error) => void) | undefined;
}
