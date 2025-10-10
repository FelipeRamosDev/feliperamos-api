import AIAgent from '../AIAgent';
import ErrorAICore from '../ErrorAICore';

export default class AgentStore<TContext = any> extends Map<string, AIAgent<TContext>> {
   constructor(agents?: AIAgent<TContext>[]) {
      super();

      agents?.forEach(agent => this.set(agent.name, agent));
   }

   getAgent(name: string): AIAgent<TContext> | undefined {
      return this.get(name);
   }

   setAgent(agent: AIAgent<TContext>) {
      if (!agent || !(agent instanceof AIAgent)) {
         throw new ErrorAICore(`It's required to provide a valid AIAgent instance to be added to the AgentStore!`, 'ERROR_INVALID_AGENT_INSTANCE');
      }

      return this.set(agent.name, agent);
   }

   delAgent(name: string): boolean {
      return this.delete(name);
   }
}
