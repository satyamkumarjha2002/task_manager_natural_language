export interface Task {
  id: string;
  description: string;
  assignee: string;
  deadline: string;
  priority: 'P1' | 'P2' | 'P3';
  createdAt: Date;
  completed: boolean;
}

export interface ExtractedTask {
  description: string;
  assignee: string;
  deadline: string;
  priority: 'P1' | 'P2' | 'P3';
} 