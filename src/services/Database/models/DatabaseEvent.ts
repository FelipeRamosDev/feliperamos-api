import ErrorDatabase from '../ErrorDatabase';
import { DatabaseEventSetup } from '../types/models/DatabaseEvent.types';
import { EventEmitter } from 'events';
import Schema from './Schema';
import Table from './Table';

class DatabaseEvent {
   public id: string;
   public name: string;
   public type: string;
   
   private _table: Table;
   private _handler: (data: any) => void;

   static emitter = new EventEmitter();

   constructor(setup: DatabaseEventSetup, table: Table) {
      const {
         id = 'default',
         name,
         type,
         handler = () => {}
      } = setup || {};

      if (!name) {
         throw new ErrorDatabase('DatabaseEvent requires a name.', 'EVENT_NAME_REQUIRED');
      }

      if (!type || typeof type !== 'string') {
         throw new ErrorDatabase('DatabaseEvent requires a valid type.', 'EVENT_TYPE_REQUIRED');
      }

      if (typeof handler !== 'function') {
         throw new ErrorDatabase('DatabaseEvent requires a valid handler function.', 'EVENT_HANDLER_REQUIRED');
      }

      this.id = id;
      this.name = name;
      this.type = type;

      this._handler = handler;
      this._table = table;

      DatabaseEvent.emitter.on(this.nativeId, this._handler);
   }

   get nativeId(): string {
      if (!this.table?.name) {
         throw new ErrorDatabase('Table name is required to generate nativeId for DatabaseEvent.', 'TABLE_NAME_REQUIRED');
      }

      return `database:${this.table.name}:${this.name}`;
   }

   get table(): Table {
      return this._table;
   }

   trigger(data: any): void {
      try {
         DatabaseEvent.emitter.emit(this.nativeId, data);
      } catch (error: any) {
         throw new ErrorDatabase(`Error in event handler for ${this.name} -> ${error.message}`, 'EVENT_HANDLER_ERROR');
      }
   }
}

export default DatabaseEvent;
