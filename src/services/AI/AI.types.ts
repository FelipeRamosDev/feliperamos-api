import { MicroserviceSetup } from "../Microservice/Microservice.types";

export interface AISetup extends MicroserviceSetup {
   apiKey: string;
   assistantID?: string;
   model?: string;
}

export type CreateResponseOpt = {
   model?: string;
   instructions?: string;
   instructionsFromFile?: string;
};

export type ResponseInput = {
   role: 'developer' | 'user' | 'assistent';
   content: string;
};
