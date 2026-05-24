import z from 'zod';

export default z.object({
   subject: z.string().describe('A subject line for the cover letter that can be used as e-mail subject, ideally no more than 10 words.'),
   body: z.string().describe('The main content of the cover letter.')
});
