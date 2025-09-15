export default function generateCoverLetterPrompt(jobDescription: string, currentInput: string, additionalMessage: string): string {
   return `
# Prompt description
- Generate a concise and impactful cover letter body based on the provided job description.
- If any job description is provided, focus on highlighting relevant skills, experiences, and achievements that align with my professional journey that you can check on the files context of this assistant.
- The cover letter should be tailored to showcase the candidate's qualifications effectively.
- Be careful to not include any skill that I don't have. Check my CV and professional journey on the files context of this assistant.
- The tone should be professional yet engaging, aiming to capture the attention of hiring managers.
- Ensure the letter is well-structured, with a clear introduction, body, and conclusion.
- Avoid generic phrases and focus on specific details that demonstrate my suitability for the role.
- The cover letter should be ATS optimized.
- Despite being ATS optimized, the letter should be human-friendly and easy to read.

## Response format
- Only reply with the generated cover letter body in markdown.
- Do not include any additional text or explanations.
- The letter body should be ATS optimized.
- Never include references on the response. Ex.: 【4:0†Felipe_Ramos-CV_3_en.pdf】

## Job Description
${jobDescription || 'No job description provided.'}

## Current Letter
${currentInput || 'No current letter provided.'}

## Additional Message
${additionalMessage || 'No additional message provided.'}
`;
}
