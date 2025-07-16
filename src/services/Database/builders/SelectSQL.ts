import SQL from './SQL';
import { SortConfig } from '../types/builders/SQL.types';
import ErrorDatabase from '../ErrorDatabase';

/**
 * SelectSQL is a query builder for SELECT statements, extending the base SQL builder.
 * Provides a fluent interface for building SELECT queries with sorting, limiting, and field selection.
 *
 * @class SelectSQL
 * @extends SQL
 * @param {Object} database - The database instance with a pool.query method.
 * @param {string} schemaName - The schema name for the table.
 * @param {string} tableName - The table name.
 */
class SelectSQL extends SQL {
   private selectClause: string;
   private sortClause: string;

   /**
    * @constructor
    * @param {Object} database - The database instance with a pool.query method.
    * @param {string} schemaName - The schema name for the table.
    * @param {string} tableName - The table name.
    */
   constructor(database: any, schemaName: string, tableName: string) {
      super(database, schemaName, tableName);

      this.selectClause = '';
      this.sortClause = '';
   }

   /**
    * Builds the SQL SELECT query string from the current state.
    * @returns {string} The SQL query string.
    */
   toString(): string {
      if (!this.selectClause) {
         this.selectFields();
      }

      if (!this.fromClause) {
         this.from();
      }

      const queryParts = [
         this.selectClause,
         this.fromClause,
         this.joinClause,
         this.onClause,
         this.whereClause,
         this.sortClause,
         this.limitClause
      ];

      return queryParts.filter(Boolean).join(' ');
   }

   /**
    * Sets the fields to select in the query.
    * @param {string[]} [fields=['*']] - The fields to select.
    * @returns {SelectSQL}
    */
   selectFields(fields: (string | [string, string])[] = ['*']): this {
      if (Array.isArray(fields) && fields.length) {
         const validatedFields = fields.map(field => {
            if (typeof field === 'string') {
               return this.charsVerifier(field, '*.')
            }

            else if (Array.isArray(field) && field.length === 2) {
               return `${this.charsVerifier(field[0], '.')} AS ${this.charsVerifier(field[1], '.')}`;
            }

            return '';
         });

         if (this.selectClause) {
            this.selectClause = `${this.selectClause}, ${validatedFields.join(', ')}`;
         } else {
            this.selectClause = `SELECT ${validatedFields.join(', ')}`;
         }
      }

      return this;
   }

   /**
    * Adds an ORDER BY clause to the query.
    * @param {Object} sort - An object where keys are field names and values are 'ASC' or 'DESC'.
    * @returns {SelectSQL}
    */
   sort(sort: SortConfig = {}): this {
      const allowedOrders = ['ASC', 'DESC'];
      if (typeof sort !== 'object' || Object.keys(sort).length === 0) {
         return this;
      }

      const sortEntries = Object.entries(sort);
      const parsed = sortEntries.map(([key, order]) => {
         const table = this.database.getTable(this.tablePath);
         const field = table && table.getField(key);

         if (!field || !allowedOrders.includes(order.toUpperCase())) {
            return;
         }

         return `${key} ${order.toUpperCase()}`;
      }).filter(Boolean);

      if (parsed.length) {
         this.sortClause = `ORDER BY ${parsed.join(', ')}`;
      }

      return this;
   }

   populate(fieldName: string, fields: string[]): this {
      const originAllFields = `${this.tableName}.*`;

      this.selectFields([ originAllFields, ...fields ]);
      this.from([{ path: this.tablePath, alias: this.tableName }]);

      const field = this.database.getField(this.tablePath, fieldName);
      const relatedField = field.relatedField;

      if (!relatedField) {
         throw new ErrorDatabase(`Field ${fieldName} does not have a related field defined.`, 'RELATED_FIELD_NOT_DEFINED');
      }

      this.join(relatedField.tablePath);
      this.joinOn(fieldName, relatedField);

      return this;  
   }
}

export = SelectSQL;
