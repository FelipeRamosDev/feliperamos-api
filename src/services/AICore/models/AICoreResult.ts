import { AICoreResultSetup, AIModels, CellRole } from '../AICore.types';
import ErrorAICore from '../ErrorAICore';
import AICoreInputCell from '../models/AICoreInputCell';
import { defaultModel } from '../../../app.config';
import AICoreChat from '../AICoreChat';
import AIAgent from '../AIAgent';

export default class AICoreResult {
   private _parent?: AICoreChat | AIAgent;
   private _instructions?: string;
   private _input: AICoreInputCell[];
   private _model: AIModels;

   public parentInstructions?: string;

   constructor (setup: AICoreResultSetup, parent?: AICoreChat | AIAgent) {
      const { model = defaultModel } = setup || {};

      this._parent = parent;
      this._input = [];
      this._model = model;
      this._instructions = '';
      this.parentInstructions;
   }

   public get parent(): AICoreChat | AIAgent | undefined {
      return this._parent;
   }

   public get input(): AICoreInputCell[] {
      return this._input;
   }

   public get model(): AIModels {
      return this._model;
   }

   public get instructions(): string | undefined {
      return this._instructions;
   }

   public get fullInstructions(): string | undefined {
      return [this.parentInstructions, this._instructions].filter(s => typeof s === 'string' && s.trim().length > 0).join('\n\n') || undefined;
   }

   setModel(model?: AIModels): this {
      if (!model || typeof model !== 'string' || model.trim().length === 0) {
         return this;
      }

      this._model = model;
      return this;
   }

   setInstructions(instructions: string): AICoreInputCell {
      if (!instructions || typeof instructions !== 'string' || instructions.trim().length === 0) {
         throw new ErrorAICore('Invalid instructions provided to setInstructions method. Instructions must be a non-empty string.', 'AICORE_RESULT_INVALID_INSTRUCTIONS');
      }

      this._instructions = instructions;
      const cell = this.addCell('system', this.instructions);
      return cell;
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
