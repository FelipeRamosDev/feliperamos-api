import SQL from './SQL';
import ErrorDatabase from '../ErrorDatabase';
import PostgresDB from '../PostgresDB';

/**
 * DeleteSQL is a query builder for DELETE statements, extending the base SQL builder.
 * Provides a fluent interface for building and executing DELETE queries with parameterized values.
 *
 * @class DeleteSQL
 * @extends SQL
 * @param {PostgresDB} database - The database instance with a pool.query method.
 * @param {string} schemaName - The schema name for the table.
 * @param {string} tableName - The table name.
 */
class DeleteSQL extends SQL {
   public queryType: string;

   /**
    * @constructor
    * @param {PostgresDB} database - The database instance with a pool.query method.
    * @param {string} schemaName - The schema name for the table.
    * @param {string} tableName - The table name.
    */
   constructor(database: PostgresDB, schemaName: string, tableName: string) {
      super(database, schemaName, tableName);

      this.queryType = 'DELETE';
      this.isAllowedNullWhere = false;
   }

   /**
    * Returns the DELETE FROM clause for the query.
    * @returns {string} The DELETE FROM clause.
    */
   get deleteClause(): string {
      return `DELETE FROM ${this.tablePath}`;
   }

   /**
    * Builds the SQL DELETE query string from the current state.
    * Throws if no WHERE clause is set and allowNullWhere is not enabled.
    * @returns {string} The SQL query string.
    * @throws {Error} If no WHERE clause is set and allowNullWhere is not enabled.
    */
   toString(): string {
      if (!this.whereClause && !this.isAllowedNullWhere) {
         throw new ErrorDatabase('Where clause is required for delete queries unless allowNullWhere is set.', 'DELETE_QUERY_NO_WHERE');
      }

      return [
         this.deleteClause,
         this.whereClause,
         this.returningClause
      ].filter(Boolean).join(' ');
   }
}

export default DeleteSQL;
