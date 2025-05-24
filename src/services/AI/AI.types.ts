export type AIOptions = {
   assistantID?: string;
};

export type CreateResponseOpt = {
   model?: string;
   instructions?: string;
   instructionsFromFile?: string;
};

export type ResponseInput = {
   role: 'developer' | 'user' | 'assistent';
   content: string;
};
