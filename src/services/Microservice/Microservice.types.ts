import EventEndpoint from "../../models/EventEndpoint";

export interface MicroserviceSetup {
   id: string;
   containerName?: string;
   endpoints?: EventEndpoint[];
   onReady?: () => void;
   onError?: (error: Error) => void;
}
