import { useState, useEffect } from 'react';
import { ExtractedTask } from '@/types/task';
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

interface EditExtractedTaskDialogProps {
  task: ExtractedTask | null;
  taskIndex: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (taskIndex: number, updatedTask: ExtractedTask) => void;
}

export function EditExtractedTaskDialog({ task, taskIndex, open, onOpenChange, onSave }: EditExtractedTaskDialogProps) {
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'P1' | 'P2' | 'P3'>('P3');

  // Update form when task changes
  useEffect(() => {
    if (task) {
      setDescription(task.description);
      setAssignee(task.assignee);
      setDeadline(task.deadline);
      setPriority(task.priority);
    }
  }, [task]);

  const handleSave = () => {
    if (!task || taskIndex === null) return;
    
    const updatedTask: ExtractedTask = {
      description,
      assignee,
      deadline,
      priority,
    };
    
    onSave(taskIndex, updatedTask);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Extracted Task</DialogTitle>
          <DialogDescription>
            Modify the extracted task before saving to your database.
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!description.trim() || !assignee.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 