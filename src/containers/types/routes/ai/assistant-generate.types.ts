export interface AssistantGenerateDataResponse {
   input?: string;
   threadID?: string;
}

export type AssistantGenerateDoneResponse = {
   success?: boolean;
   threadID?: string;
   output?: string;
   error?: boolean;
   data?: any;
}
