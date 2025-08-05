import { ExperienceSetup } from "../../experiences_schema/Experience/Experience.types";
import { SkillSetup } from "../../skills_schema/Skill/Skill.types";
import CVSet from "../CVSet/CVSet";
import { CVSetSetup } from "../CVSet/CVSet.types";

export interface CVSetup extends CVSetSetup {
   title: string;
   experience_time?: number;
   is_master?: boolean;
   notes?: string;
   cv_experiences?: (ExperienceSetup | number)[];
   cv_skills?: (SkillSetup | number)[];
   cv_owner?: number; 
   languageSets?: CVSet[];
   cv_owner_id?: number;
}
