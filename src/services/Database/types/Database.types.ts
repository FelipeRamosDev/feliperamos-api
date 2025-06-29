import Schema from "../builders/Schema";
import ErrorDatabase from "../ErrorDatabase";

export interface DatabaseSetup {
   dbName?: string;
   host?: string;
   password?: string;
   schemas?: Schema[];
   onReady?: (database: any) => void;
   onError?: (error: ErrorDatabase) => void;
}
