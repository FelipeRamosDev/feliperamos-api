import Table from '../../../services/Database/models/Table';

export default new Table({
   name: 'opportunities',
   fields: [
      { name: 'id', primaryKey: true, autoIncrement: true },
      { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'start_date', type: 'DATE' },
      { name: 'end_date', type: 'DATE' },
      { name: 'job_title', type: 'VARCHAR(255)' },
      { name: 'job_description', type: 'TEXT' },
      { name: 'location', type: 'VARCHAR(255)' },
      { name: 'seniority_level', type: 'VARCHAR(255)' },
      { name: 'employment_type', type: 'VARCHAR(255)' },
      {
         name: 'cv_id',
         type: 'INTEGER',
         relatedField: {
            schema: 'curriculums_schema',
            table: 'cvs',
            field: 'id'
         }
      },
      {
         name: 'company_id',
         type: 'INTEGER',
         relatedField: {
            schema: 'companies_schema',
            table: 'companies',
            field: 'id'
         }
      }
   ]
});
