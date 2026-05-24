import z from 'zod';

export default z.object({
   summary: z.string().optional().nullable().describe('Use Markdown. The generated summary for the CV. In case you don\'t have enough information to generate a summary, this field can be left empty and the agent can use the message field to ask for more details.'),
   feedback: z.string().describe('Use Markdown. In case the agent needs to clarify something or provide additional info, it can be included in this field.')
});
