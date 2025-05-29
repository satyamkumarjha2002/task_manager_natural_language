import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (taskId: string, updatedTask: Partial<Task>) => Promise<void>;
}

export function EditTaskDialog({ task, open, onOpenChange, onSave }: EditTaskDialogProps) {
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'P1' | 'P2' | 'P3'>('P3');
  const [completed, setCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update form when task changes
  useEffect(() => {
    if (task) {
      setDescription(task.description);
      setAssignee(task.assignee);
      setDeadline(task.deadline);
      setPriority(task.priority);
      setCompleted(task.completed);
    }
  }, [task]);

  const handleSave = async () => {
    if (!task) return;
    
    setIsSaving(true);
    try {
      await onSave(task.id, {
        description,
        assignee,
        deadline,
        priority,
        completed,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Description</label>
            <Textarea
              placeholder="Enter task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned To</label>
              <Input
                placeholder="Enter assignee name..."
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={(value: 'P1' | 'P2' | 'P3') => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P1">P1 - High Priority</SelectItem>
                  <SelectItem value="P2">P2 - Medium Priority</SelectItem>
                  <SelectItem value="P3">P3 - Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Deadline</label>
            <Input
              placeholder="Enter deadline (e.g., Tomorrow 5PM, Next Friday, etc.)..."
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="completed" className="text-sm font-medium">
              Mark as completed
            </label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || !description.trim() || !assignee.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 