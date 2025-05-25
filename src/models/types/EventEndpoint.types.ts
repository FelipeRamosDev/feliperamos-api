export interface EndpointSetup {
   path: string;
   controller: (data: any, done?: () => void | Promise<void>) => void;
}
