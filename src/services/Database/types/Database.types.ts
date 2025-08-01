import ErrorDatabase from '../ErrorDatabase';
import Schema from '../models/Schema';
import { SchemaSetup } from './models/Schema.types';

export interface DatabaseSetup {
   dbName?: string;
   host?: string;
   password?: string;
   schemas?: (Schema | SchemaSetup)[];
   onReady?: (database: any) => void;
   onError?: (error: ErrorDatabase) => void;
}
