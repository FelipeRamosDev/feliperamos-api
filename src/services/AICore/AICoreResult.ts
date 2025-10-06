import { AICoreResultSetup, AIModels, CellRole } from './AICore.types';
import ErrorAICore from './ErrorAICore';
import AICoreInputCell from './models/AICoreInputCell';
import AICore from './AICore';

export default class AICoreResult {
   private _instructions?: string;
   private _input: AICoreInputCell[];
   private _model: AIModels;

   public parentInstructions?: string;

   constructor (setup: AICoreResultSetup) {
      const { model = AICore.defaultModel } = setup || {};

      this._input = [];
      this._model = model;
      this.parentInstructions;
   }

   public get input() {
      return this._input;
   }

   public get model(): AIModels {
      return this._model;
   }

   public get instructions(): string | undefined {
      return this._instructions;
   }

   setModel(model?: AIModels): this {
      if (!model || typeof model !== 'string' || model.trim().length === 0) {
         return this;
      }

      this._model = model;
      return this;
   }

   setInstructions(instructions: string): this {
      if (!instructions || typeof instructions !== 'string' || instructions.trim().length === 0) {
         return this;
      }

      this._instructions = [this.parentInstructions, instructions].filter(s => typeof s === 'string' && s.trim().length > 0).join('\n') || undefined;
      return this;
   }

   addCell(role: CellRole, textContent?: string): AICoreInputCell {
      if (!role || typeof role !== 'string' || role.trim().length === 0) {
         throw new ErrorAICore('Invalid role provided to addCell method. Role must be "user", "assistant", "developer", or "system".', 'AICORE_CHAT_RESPONSE_INVALID_CELL_ROLE');
      }

      const cell = new AICoreInputCell(this, {
         role,
         textContent
      });

      this._input.push(cell);
      return cell;
   }
}
