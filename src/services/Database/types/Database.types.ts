import ErrorDatabase from '../ErrorDatabase';
import { SchemaSetup } from './models/Schema.types';

export interface DatabaseSetup {
   dbName?: string;
   host?: string;
   password?: string;
   schemas?: SchemaSetup[];
   onReady?: (database: any) => void;
   onError?: (error: ErrorDatabase) => void;
}
