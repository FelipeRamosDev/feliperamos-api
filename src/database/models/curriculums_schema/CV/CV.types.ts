import { ExperienceSetup } from "../../experiences_schema/Experience/Experience.types";
import { SkillSetup } from "../../skills_schema/Skill/Skill.types";
import { CVSetSetup } from "../CVSet/CVSet.types";

export interface CVSetup extends CVSetSetup {
   title: string;
   is_master?: boolean;
   notes?: string;
   cv_experiences?: ExperienceSetup[];
   cv_skills?: SkillSetup[];
   cv_owner?: number; 
}
