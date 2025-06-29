import type { Collection } from './RedisDB.types';

/**
 * Builds a Redis key by combining a prefix and identifier with a colon separator.
 * 
 * @param prefix - The prefix for the key
 * @param uid - The unique identifier
 * @returns The constructed Redis key
 */
export function buildKey(prefix: string = '', uid: string = ''): string {
   if (!prefix && !uid) {
      return '';
   }
   if (!prefix) {
      return uid;
   }
   if (!uid) {
      return prefix;
   }
   return `${prefix}:${uid}`;
}

/**
 * Parses a document to be saved in Redis, handling different data types and collection schemas.
 * 
 * @param collection - The collection configuration object
 * @param data - The data object to be parsed
 * @returns The parsed data object ready for Redis storage
 */
export function parseDocToSave(collection: Collection | null, data: any): Record<string, any> {
   if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return {};
   }

   const parsed: Record<string, any> = {};

   Object.keys(data).forEach(key => {
      const value = data[key];

      if (value === null || value === undefined) {
         return; // Skip null/undefined values
      }

      // Handle different data types
      if (typeof value === 'object') {
         if (Array.isArray(value)) {
            parsed[key] = JSON.stringify(value);
         } else if (value instanceof Date) {
            parsed[key] = value.toISOString();
         } else {
            parsed[key] = JSON.stringify(value);
         }
      } else if (typeof value === 'boolean') {
         parsed[key] = value.toString();
      } else if (typeof value === 'number') {
         parsed[key] = value.toString();
      } else {
         parsed[key] = String(value);
      }
   });

   return parsed;
}

/**
 * Parses a document retrieved from Redis, converting string values back to their appropriate types.
 * 
 * @param collection - The collection configuration object
 * @param doc - The document object retrieved from Redis
 * @returns The parsed document with proper data types
 */
export function parseDocToRead(collection: Collection | null, doc: Record<string, string>): any {
   if (!doc || typeof doc !== 'object') {
      return doc;
   }

   const parsed: Record<string, any> = {};

   Object.keys(doc).forEach(key => {
      const value = doc[key];

      if (value === null || value === undefined || value === '') {
         parsed[key] = null;
         return;
      }

      // Try to parse as number
      if (!isNaN(Number(value)) && value.trim() !== '') {
         const numValue = Number(value);
         if (Number.isInteger(numValue)) {
            parsed[key] = numValue;
            return;
         } else {
            parsed[key] = numValue;
            return;
         }
      }

      // Try to parse as boolean
      if (value === 'true' || value === 'false') {
         parsed[key] = value === 'true';
         return;
      }

      // Try to parse as JSON
      try {
         const jsonValue = JSON.parse(value);
         parsed[key] = jsonValue;
         return;
      } catch (error) {
         // Not valid JSON, keep as string
      }

      // Try to parse as Date (ISO string format)
      if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
         const dateValue = new Date(value);
         if (!isNaN(dateValue.getTime())) {
            parsed[key] = dateValue;
            return;
         }
      }

      // Keep as string
      parsed[key] = value;
   });

   return parsed;
}
