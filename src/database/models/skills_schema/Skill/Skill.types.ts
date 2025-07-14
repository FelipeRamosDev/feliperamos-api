import { SkillSetSetup } from "../SkillSet/SkillSet.types";

export interface SkillSetup extends SkillSetSetup {
   name: string;
   level: number;
   category: string;
}
