export default function generateCVSummaryPrompt(jobDescription: string, currentInput: string, customPrompt: string): string {
   return `
# Prompt description
- Generate a concise and impactful CV summary based on the provided job description.
- Focus on highlighting relevant skills, experiences, and achievements that align with the job requirements.
- The summary should be tailored to showcase the candidate's qualifications effectively.
- Be careful to not include any skill that I don't have.

## Response format
- Only reply with the generated CV summary markdown.
- Do not include any additional text or explanations.
- The summary should be ATS optimized in bullet list format.

## Job Description
${jobDescription || 'No job description provided.'}

## Current Summary
${currentInput || 'No current summary provided.'}

## Custom Prompt
Based on the "Current Summary" above, refactor the "Current Summary" considering the prompt below: 
${customPrompt || 'No custom prompt provided.'}
`;
}
