import { TableSetup } from '../types/models/Table.types';
import Field from './Field';
import ErrorDatabase from '../ErrorDatabase';
import { DatabaseEventSetup } from '../types/models/DatabaseEvent.types';
import DatabaseEventStore from './DatabaseEventStore';

/**
 * Table class represents a database table with a name and fields.
 * It initializes with a name and an array of field definitions.
 * Provides methods to retrieve fields and build SQL for table creation.
 *
 * @class Table
 * @param {Object} setup - The setup object for the table.
 * @param {string} setup.name - The name of the table.
 * @param {Field[]} setup.fields - The fields in the table.
 */
class Table {
   public name: string;
   public fields: Field[];
   private _events: Map<string, DatabaseEventStore>;

   /**
    * Creates a new Table instance.
    * @param {Object} setup - The setup object for the table.
    */
   constructor(setup: TableSetup = {} as TableSetup) {
      const { name, fields = [], events = {} } = setup;

      if (!name) {
         throw new ErrorDatabase('Table name is required', 'TABLE_NAME_REQUIRED');
      }

      this.name = name;
      this.fields = fields.map(field => new Field(field));
      this._events = new Map<string, DatabaseEventStore>();

      if (Array.isArray(events.customs)) {
         events.customs.forEach(customEvent => {
            this.addEvent({
               name: customEvent.name,
               type: customEvent.type,
               handler: customEvent.handler
            });
         });
      }

      if (events.onAfterSelect) {
         this.addEvent({
            name: 'onAfterSelect',
            type: 'after-select',
            handler: events.onAfterSelect
         });
      }

      if (events.onAfterDelete) {
         this.addEvent({
            name: 'onAfterDelete',
            type: 'after-delete',
            handler: events.onAfterDelete
         });
      }

      if (events.onAfterInsert) {
         this.addEvent({
            name: 'onAfterInsert',
            type: 'after-insert',
            handler: events.onAfterInsert
         });
      }

      if (events.onAfterUpdate) {
         this.addEvent({
            name: 'onAfterUpdate',
            type: 'after-update',
            handler: events.onAfterUpdate
         });
      }

      if (events.onBeforeDelete) {
         this.addEvent({
            name: 'onBeforeDelete',
            type: 'before-delete',
            handler: events.onBeforeDelete
         });
      }

      if (events.onBeforeInsert) {
         this.addEvent({
            name: 'onBeforeInsert',
            type: 'before-insert',
            handler: events.onBeforeInsert
         });
      }

      if (events.onBeforeUpdate) {
         this.addEvent({
            name: 'onBeforeUpdate',
            type: 'before-update',
            handler: events.onBeforeUpdate
         });
      }

      if (events.onBeforeSelect) {
         this.addEvent({
            name: 'onBeforeSelect',
            type: 'before-select',
            handler: events.onBeforeSelect
         });
      }
   }

   /**
    * Returns a field object by name from this table.
    * @param {string} fieldName - The name of the field.
    * @returns {Field} The field object.
    * @throws {ErrorDatabase} If fieldName is not provided or field is not found.
    */
   getField(fieldName: string): Field {
      if (!fieldName || typeof fieldName !== 'string') {
         throw new ErrorDatabase('getField method requires a valid "fieldName" parameter of type string.', 'FIELD_NAME_REQUIRED');
      }

      const field = this.fields.find(f => f.name === fieldName);
      if (!field) {
         throw new ErrorDatabase(`Field ${fieldName} not found in table ${this.name}.`, 'FIELD_NOT_FOUND');
      }

      return field;
   }

   /**
    * Builds the SQL query to create this table in the given schema.
    * @param {string} schemaName - The name of the schema.
    * @returns {string} The SQL CREATE TABLE query.
    * @throws {ErrorDatabase} If schemaName or table name is not set.
    */
   buildCreateTableQuery(schemaName: string): string {
      if (!schemaName || !this.name) {
         throw new ErrorDatabase('Table name and schema name is required to build the "create table" query', 'TABLE_NAME_OR_SCHEMA_NAME_REQUIRED');
      }

      const fieldsDefinition = this.fields.map(field => field.buildDefinitionSQL()).join(', ');
      return `CREATE TABLE IF NOT EXISTS ${schemaName}.${this.name} (${fieldsDefinition});`;
   }

   addEvent(eventSetup: DatabaseEventSetup): void {
      const existingEventStore = this._events.get(eventSetup.name);

      if (existingEventStore) {
         existingEventStore.addEvent(eventSetup);
      } else {
         const eventStore = new DatabaseEventStore(eventSetup.name);

         eventStore.addEvent(eventSetup);
         this._events.set(eventSetup.name, eventStore);
      }
   }

   triggerEvent(eventName: string, data: any): void {
      const eventStore = this._events.get(eventName);
      if (!eventStore) {
         return;
      }

      eventStore.triggerEvent(data);
   }
}

export default Table;
