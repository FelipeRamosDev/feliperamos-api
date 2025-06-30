export interface AssistantMessageDataResponse {
   input?: string;
   threadID?: string;
}

export type AssistantMessageDoneResponse = {
   success?: boolean;
   threadID?: string;
   output?: string;
   error?: boolean;
   data?: any;
}
