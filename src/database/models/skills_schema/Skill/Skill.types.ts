import { SkillSetSetup } from "../SkillSet/SkillSet.types";

export interface SkillCreateSetup {
   name: string;
   level: number;
   category: string;
   skill_id?: number;
   language_set?: string;
   journey?: string;
   user_id?: number; 
}

export interface SkillSetup extends SkillSetSetup {
   name: string;
   level: number;
   category: string;
}

// export interface SkillCreateSetup extends SkillSetup {}
