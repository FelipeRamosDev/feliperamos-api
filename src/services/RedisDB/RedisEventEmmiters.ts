import { EventEmitter } from 'events';
import type { RedisEventContext, NextCallback, RejectCallback } from './RedisDB.types';

// Create a shared event emitter for Redis events
const redisEventEmitter = new EventEmitter();

class RedisEventEmitters {
   static preCreate(this: RedisEventContext, next: NextCallback, reject: RejectCallback): void {
      const collectionEvent = this.collectionSet?.redisEvents?.preCreate;

      if (typeof collectionEvent === 'function') {
         redisEventEmitter.emit(`redis:precreate:${this.collection}`, this, next, reject);
      } else {
         next();
      }
   }

   static postCreate(this: RedisEventContext): void {
      redisEventEmitter.emit(`redis:postcreate:${this.collection}`, this);
   }

   static preRead(this: RedisEventContext, next: NextCallback, reject: RejectCallback): void {
      const collectionEvent = this.collectionSet?.redisEvents?.preRead;

      if (typeof collectionEvent === 'function') {
         redisEventEmitter.emit(`redis:preread:${this.collection}`, this, next, reject);
      } else {
         next();
      }
   }

   static postRead(this: RedisEventContext): void {
      redisEventEmitter.emit(`redis:postread:${this.collection}`, this);
   }

   static preUpdate(this: RedisEventContext, next: NextCallback, reject: RejectCallback): void {
      const collectionEvent = this.collectionSet?.redisEvents?.preUpdate;

      if (typeof collectionEvent === 'function') {
         redisEventEmitter.emit(`redis:preupdate:${this.collection}`, this, next, reject);
      } else {
         next();
      }
   }

   static postUpdate(this: RedisEventContext): void {
      redisEventEmitter.emit(`redis:postupdate:${this.collection}`, this);
   }

   static preDelete(this: RedisEventContext, next: NextCallback, reject: RejectCallback): void {
      const collectionEvent = this.collectionSet?.redisEvents?.preDelete;

      if (typeof collectionEvent === 'function') {
         redisEventEmitter.emit(`redis:predelete:${this.collection}`, this, next, reject);
      } else {
         next();
      }
   }

   static postDelete(this: RedisEventContext): void {
      redisEventEmitter.emit(`redis:postdelete:${this.collection}`, this);
   }

   // Export the event emitter for external listeners
   static get eventEmitter(): EventEmitter {
      return redisEventEmitter;
   }
}

export default RedisEventEmitters;
