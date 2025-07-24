import TableRow from '../../../../services/Database/models/TableRow';
import { Experience } from '../../experiences_schema';
import { Skill } from '../../skills_schema';
import CVSet from '../CVSet/CVSet';
import { CVSetSetup } from '../CVSet/CVSet.types';
import { CVSetup } from './CV.types';

export default class CV extends CVSet {
   user_id?: number | null;
   title: string;
   is_master: boolean;
   notes?: string;
   experiences?: Experience[];
   skills?: Skill[];

   constructor(setup: Partial<CVSetup>) {
      super(setup as CVSetSetup, 'curriculums_schema', 'cvs');

      const {
         title = '',
         is_master = false,
         notes = '',
         user_id = null,
         skills = [],
         experiences = []
      } = setup || {};

      this.title = title;
      this.is_master = Boolean(is_master);
      this.notes = notes;
      this.user_id = user_id;

      this.experiences = experiences.map(exp => new Experience(exp));
      this.skills = skills.map(skill => new Skill(skill));
   }
}
