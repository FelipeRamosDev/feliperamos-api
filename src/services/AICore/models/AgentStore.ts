import AIAgent from "../AIAgent";
import ErrorAICore from "../ErrorAICore";

export default class AgentStore extends Map<string, AIAgent> {
   constructor(agents?: AIAgent[]) {
      super();

      agents?.forEach(agent => this.set(agent.name, agent));
   }

   getAgent(name: string): AIAgent | undefined {
      return this.get(name);
   }

   setAgent(agent: AIAgent) {
      if (!agent || !(agent instanceof AIAgent)) {
         throw new ErrorAICore(`It's required to provide a valid AIAgent instance to be added to the AgentStore!`, 'ERROR_INVALID_AGENT_INSTANCE');
      }

      return this.set(agent.name, agent);
   }

   delAgent(name: string): boolean {
      return this.delete(name);
   }
}
