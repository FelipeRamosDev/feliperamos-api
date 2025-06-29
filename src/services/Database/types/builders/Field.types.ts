import { RelatedFieldSetup } from './RelatedField.types';

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
