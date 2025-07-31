import { TableSetup } from './Table.types';

export interface SchemaSetup {
   name: string;
   tables?: TableSetup[];
}
