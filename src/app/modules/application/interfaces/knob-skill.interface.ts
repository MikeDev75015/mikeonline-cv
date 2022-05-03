import { SkillV1 } from '../../../core/interfaces/models/v1/skill.interface';

export interface KnobSkill extends SkillV1 {
  experienceYears: {
    value: number;
    text: string;
  };
}
