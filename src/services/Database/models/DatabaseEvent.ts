import ErrorDatabase from '../ErrorDatabase';
import { DatabaseEventSetup } from '../types/models/DatabaseEvent.types';
import { EventEmitter } from 'events';

class DatabaseEvent {
   public id: string;
   public name: string;
   public type: string;

   private _handler: (data: any) => void;

   static emitter = new EventEmitter();

   constructor(setup: DatabaseEventSetup) {
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

      DatabaseEvent.emitter.on(this.nativeId, this._handler);
   }

   get nativeId(): string {
      return `database:${this.name}`;
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
