export default class TableRow {
   private _rawData: any;

   public schemaName: string;
   public tableName: string;

   public id: number;
   public created_at: Date;

   constructor(schemaName: string, tableName: string, rawData: any) {
      this._rawData = () => rawData;

      if (!schemaName || !tableName) {
         throw new Error('Schema name and table name are required to create a TableRow instance.');
      }

      const {
         id,
         created_at
      } = rawData || {};

      this.id = Number(id);
      this.created_at = created_at;
      this.schemaName = schemaName;
      this.tableName = tableName;
   }

   get rawData(): any {
      return this._rawData();
   }
}