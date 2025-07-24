import ErrorDatabase from "../ErrorDatabase";

export default class TableRow {
   private _rawData: any;

   public schemaName: string;
   public tableName: string;

   public id?: number;
   public created_at: Date;
   public updated_at?: Date;

   constructor(schemaName: string, tableName: string, rawData: any) {
      this._rawData = () => rawData;

      if (!schemaName || !tableName) {
         throw new ErrorDatabase('Schema name and table name are required to create a TableRow instance.', 'TABLEROW_CREATION_ERROR');
      }

      const {
         id,
         created_at,
         updated_at
      } = rawData || {};

      const parsedId = id ? (isNaN(parseInt(id, 10)) ? undefined : parseInt(id, 10)) : undefined;

      this.id = parsedId;
      this.created_at = created_at;
      this.updated_at = updated_at;
      this.schemaName = schemaName;
      this.tableName = tableName;
   }

   get rawData(): any {
      return this._rawData();
   }
}