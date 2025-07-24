import { ExperienceSetup } from "../../experiences_schema/Experience/Experience.types";
import { SkillSetup } from "../../skills_schema/Skill/Skill.types";

export interface CVSetup {
   id: number;
   created_at: Date;
   updated_at: Date;
   title: string;
   is_master: boolean;
   user_id: number;
   notes?: string;
   experiences?: ExperienceSetup[];
   skills?: SkillSetup[];
}
