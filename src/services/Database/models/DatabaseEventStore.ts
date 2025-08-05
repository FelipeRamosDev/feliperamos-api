import ErrorDatabase from '../ErrorDatabase';
import { DatabaseEventSetup } from '../types/models/DatabaseEvent.types';
import DatabaseEvent from './DatabaseEvent';
import Schema from './Schema';
import Table from './Table';

class DatabaseEventStore {
   public name: string;
   private _events: Map<string, DatabaseEvent>;

   constructor(name: string) {
      if (!name) {
         throw new ErrorDatabase('DatabaseEventStore requires a name.', 'EVENT_STORE_NAME_REQUIRED');
      }

      this.name = name;
      this._events = new Map();
   }

   get events(): DatabaseEvent[] {
      return Array.from(this._events.values()).flat();
   }

   triggerEvent(data: any): void {
      this._events.forEach((event: DatabaseEvent) => event.trigger(data));
   }

   addEvent(eventSetup: DatabaseEventSetup, instance: Table): void {
      const event = new DatabaseEvent(eventSetup, instance);

      if (this._events.has(event.id)) {
         console.warn(`Event with id ${event.id} already exists in store ${this.name}. Overwriting.`);
      }
      
      this._events.set(event.id, event);
   }

   removeEvent(eventId: string): void {
      this._events.delete(eventId);
   }
}

export default DatabaseEventStore;
