export type AiCpuAssistantMessageDataResponse = {
   input?: string;
   threadID?: string;
}

export type AiCpuAssistantMessageDoneResponse = {
   success?: boolean;
   threadID?: string;
   output?: string;
   error?: boolean;
   data?: any;
}
