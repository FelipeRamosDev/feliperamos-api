import { DatabaseEventsConfig, DatabaseEventSetup } from './DatabaseEvent.types';
import { FieldSetup } from './Field.types';

export interface TableSetup {
   name: string;
   fields?: FieldSetup[];
   events?: DatabaseEventsConfig;
}
