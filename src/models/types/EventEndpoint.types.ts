export interface EndpointSetup {
   path: string;
   controller: (data: any) => void;
}
