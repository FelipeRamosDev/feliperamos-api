import { Pool } from 'pg';
import { DatabaseSetup } from './Database.types';

export interface PostgresDBSetup extends DatabaseSetup {
   user?: string;
   port?: number;
}

export interface ColumnInfo {
   column_name: string;
   data_type: string;
   is_nullable: string;
}
