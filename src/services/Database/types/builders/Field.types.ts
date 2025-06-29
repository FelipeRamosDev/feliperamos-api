export interface FieldSetup {
   name: string;
   type?: string;
   defaultValue?: any;
   notNull?: boolean;
   unique?: boolean;
   primaryKey?: boolean;
   autoIncrement?: boolean;
   relatedField?: RelatedFieldSetup;
}

export interface RelatedFieldSetup {
   schema: string;
   table: string;
   field: string;
}
