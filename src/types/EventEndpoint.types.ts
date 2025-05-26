export interface EndpointSetup {
   path: string;
   controller: (data: any, done?: (...args: any) => void | Promise<void>) => void;
}
