import TableRow from '@/services/Database/models/TableRow';
import { SkillSetup } from './Skill.types';

export default class Skill extends TableRow {
   public name: string;
   public level?: 'beginner' | 'intermediate' | 'advanced';
   public description?: string;

   constructor (setup: SkillSetup) {
      super('skills_schema', 'skills', setup);

      const { name, level, description } = setup || {};

      this.name = name;
      this.level = level;
      this.description = description;
   }
}
