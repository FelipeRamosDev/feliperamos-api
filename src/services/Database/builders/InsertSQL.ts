import SQL from './SQL';
import ErrorDatabase from '../ErrorDatabase';

/**
 * InsertSQL is a query builder for INSERT statements, extending the base SQL builder.
 * Provides a fluent interface for building and executing INSERT queries with parameterized values.
 *
 * @class InsertSQL
 * @extends SQL
 * @param {Object} database - The database instance with a pool.query method.
 * @param {string} schemaName - The schema name for the table.
 * @param {string} tableName - The table name.
 */
class InsertSQL extends SQL {
   private insertClause: string;
   public queryType: string;

   /**
    * @constructor
    * @param {Object} database - The database instance with a pool.query method.
    * @param {string} schemaName - The schema name for the table.
    * @param {string} tableName - The table name.
    */
   constructor(database: any, schemaName: string, tableName: string) {
      super(database, schemaName, tableName);
      
      this.queryType = 'INSERT';
      this.insertClause = '';
   }

   /**
    * Builds the SQL INSERT query string from the current state.
    * @returns {string} The SQL query string.
    */
   toString(): string {
      return [
         this.insertClause,
         this.returningClause
      ].filter(Boolean).join(' ');
   }

   /**
    * Sets the data to be inserted in the query.
    * @param {Object} data - The data object where keys are column names and values are the values to insert.
    * @returns {InsertSQL}
    * @throws {ErrorDatabase} If data is not an object.
    */
   data(data: Record<string, any>): this {
      if (typeof data !== 'object' || data === null) {
         throw new ErrorDatabase('Data must be an object', 'INSERT_QUERY_INVALID_DATA');
      }

      const insertClause = [ 'INSERT INTO', this.tablePath ];
      const keys = Object.keys(data);

      this.values = Object.values(data);
      const placeholders = this.values.map((_, index) => `$${index + 1}`).join(', ')

      insertClause.push('(');
      insertClause.push(keys.join(', '));
      insertClause.push(')');

      insertClause.push('VALUES');
      insertClause.push('(');
      insertClause.push(placeholders);
      insertClause.push(')');

      this.insertClause = insertClause.join(' ');
      return this;
   }
}

export default InsertSQL;
