import TableRow from '../../../../services/Database/models/TableRow';
import { LanguageSetSetup } from './LanguageSet.types';

class LanguageSet extends TableRow {
   public language_set: string;
   public display_name: string;

   constructor (setup: LanguageSetSetup, schemaName: string = 'languages_schema', tableName: string = 'language_sets') {
      super(schemaName, tableName, setup);
      const { language_set, display_name } = setup || {};

      if (!language_set || !display_name) {
         throw new Error('Missing required fields for LanguageSet');
      }

      this.language_set = language_set;
      this.display_name = display_name;
   }

}

export default LanguageSet;
