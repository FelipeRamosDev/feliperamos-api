export interface SelectField {
   name: string;
   alias?: string;
}

export interface PopulateConfig {
   fieldName: string;
   fields: string[];
}
