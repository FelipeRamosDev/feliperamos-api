import { DatabaseSetup } from './types/Database.types';
import Schema from './models/Schema';
import Table from './models/Table';
import Field from './models/Field';
import ErrorDatabase from './ErrorDatabase';
import { SchemaSetup } from './types/models/Schema.types';

/**
 * Base class for database services.
 *
 * This class defines the interface and common properties for SQL and NoSQL databases.
 * CRUD and schema methods must be implemented in specific subclasses (e.g., PostgresDB, MongoDB).
 *
 * @class DataBase
 */
class DataBase {
   public dbName: string;
   public host: string;
   public schemas: Map<string, Schema>;
   public onReady: (database: any) => void;
   public onError: (database: ErrorDatabase) => void;
   public pool: any;

   /**
    * 
    * @param {object} setup - Database configuration object.
    * @param {string} [setup.dbName='default-db'] - Database name.
    * @param {string} [setup.host='0.0.0.0'] - Database host.
    * @param {string} [setup.password=''] - Database password.
    * @param {Function} [setup.onReady] - Callback function to execute when the connection is ready.
    * @param {Function} [setup.onError] - Callback function to execute when an error occurs.
    *
    */
   constructor(setup: DatabaseSetup) {
      const {
         dbName = 'default-db',
         host = '0.0.0.0',
         schemas = [],
         onReady = () => {},
         onError = () => {}
      } = setup || {};

      this.dbName = dbName;
      this.host = host;
      this.schemas = new Map();
      this.onReady = onReady;
      this.onError = onError;
      this.pool = null;

      schemas.forEach((schema: SchemaSetup) => {
         const newSchema = schema instanceof Schema ? schema : new Schema(schema);
         this.schemas.set(schema.name, newSchema);
      });
   }

   /**
    * Returns a schema object by name.
    * @param {string} schemaName - The name of the schema.
    * @returns {Schema} The schema object.
    * @throws {ErrorDatabase} If schemaName is not provided or schema is not found.
    */
   getSchema(schemaName: string): Schema {
      if (!schemaName) {
         throw new ErrorDatabase('Schema name is required.', 'SCHEMA_NAME_REQUIRED');
      }

      const schema = this.schemas.get(schemaName);
      if (!schema) {
         throw new ErrorDatabase(`Schema ${schemaName} not found.`, 'SCHEMA_NOT_FOUND');
      }

      return schema;
   }

   /**
    * Returns a table object by full path (schema.table).
    * @param {string} tablePath - The table path in the format 'schema.table'.
    * @returns {Table} The table object.
    * @throws {ErrorDatabase} If the table path is invalid or table is not found.
    */
   getTable(tablePath: string): Table {
      const [ schemaName, tableName ] = tablePath.split('.');
      if (!schemaName || !tableName) {
         throw new ErrorDatabase(`Invalid table name format: ${tablePath}. Expected format is 'schema.table'.`, 'INVALID_TABLE_PATH');
      }

      const schema = this.getSchema(schemaName);
      const table = schema.getTable(tableName);
      if (!table) {
         throw new ErrorDatabase(`Table ${tableName} not found in schema ${schemaName}.`, 'TABLE_NOT_FOUND');
      }

      return table;
   }

   /**
    * Returns a field object by table path and the field name (schema.table and field).
    * @param {string} tablePath - The table path in the format 'schema.table'.
    * @param {string} fieldName - The name of the field.
    * @returns {Field} The field object.
    */
   getField(tablePath: string, fieldName: string): Field {
      const [ schemaName, tableName ] = tablePath.split('.');

      const schema = this.getSchema(schemaName);
      const table = schema && schema.getTable(tableName);
      const field = table && table.getField(fieldName);

      return field;
   }

   /**
    * Abstract method to create a schema. Must be implemented in subclasses.
    * @throws {ErrorDatabase} Always throws unless implemented in subclass.
    */
   async createSchema(schema?: any): Promise<void> {
      throw new ErrorDatabase('Method createSchema is implemented in PostgresDB or MongoDB', 'CREATE_SCHEMA_NOT_IMPLEMENTED');
   }

   /**
    * Abstract method to create a record. Must be implemented in subclasses.
    * @throws {ErrorDatabase} Always throws unless implemented in subclass.
    */
   insert(schemaName?: string, tableName?: string): any {
      throw new ErrorDatabase('Method insert is implemented in PostgresDB or MongoDB', 'INSERT_NOT_IMPLEMENTED');
   }

   /**
    * Abstract method to select records. Must be implemented in subclasses.
    * @throws {ErrorDatabase} Always throws unless implemented in subclass.
    */
   select(schemaName?: string, tableName?: string): any {
      throw new ErrorDatabase('Method read is implemented in PostgresDB or MongoDB', 'SELECT_NOT_IMPLEMENTED');
   }

   /**
    * Abstract method to update records. Must be implemented in subclasses.
    * @throws {ErrorDatabase} Always throws unless implemented in subclass.
    */
   update(schemaName?: string, tableName?: string): any {
      throw new ErrorDatabase('Method update is implemented in PostgresDB or MongoDB', 'UPDATE_NOT_IMPLEMENTED');
   }

   /**
    * Abstract method to delete records. Must be implemented in subclasses.
    * @throws {ErrorDatabase} Always throws unless implemented in subclass.
    */
   delete(schemaName?: string, tableName?: string): any {
      throw new ErrorDatabase('Method delete is implemented in PostgresDB or MongoDB', 'DELETE_NOT_IMPLEMENTED');
   }
}

export = DataBase;
