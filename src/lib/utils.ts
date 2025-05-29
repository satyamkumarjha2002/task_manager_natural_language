import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ExtractedTask } from "@/types/task"
import OpenAI from 'openai';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
  dangerouslyAllowBrowser: true // Note: In production, move this to a server-side API route
});

/**
 * Extract tasks from meeting minutes using OpenAI GPT.
 * @param query The input string containing meeting minutes or instructions.
 * @returns An array of extracted tasks.
 */
export async function extractTasksFromQuery(query: string): Promise<ExtractedTask[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const prompt = `
You are an AI assistant that extracts actionable tasks from meeting minutes or conversations. 

Analyze the following text and extract all tasks/action items. For each task, identify:
1. A clear task description 
2. The person assigned to the task
3. The deadline (keep it as mentioned, e.g., "tonight", "tomorrow", "Wednesday", "by 5PM Friday")
4. Priority level (P1 for urgent/high priority, P2 for medium priority, P3 for low priority - default to P3 if not specified)
5.Very important: if priority is not mentioned, default to P3

Return the response as a valid JSON array where each task object has this exact structure:
{
  "description": "string",
  "assignee": "string", 
  "deadline": "string",
  "priority": "P1" | "P2" | "P3"
}

Meeting Minutes/Text:
${query}

Important: Return ONLY the JSON array, no additional text or formatting.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts tasks from meeting minutes and returns them in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      console.error('No response from OpenAI');
      return [];
    }

    // Clean the response - remove any markdown formatting
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    
    // Parse the JSON response
    const extractedTasks: ExtractedTask[] = JSON.parse(cleanedResponse);
    
    // Validate the structure
    const validTasks = extractedTasks.filter(task => 
      task.description && 
      task.assignee && 
      task.deadline && 
      ['P1', 'P2', 'P3'].includes(task.priority)
    );

    console.log('Extracted tasks:', validTasks);
    return validTasks;

  } catch (error) {
    console.error('Error extracting tasks with OpenAI:', error);
    return [];
  }
}
