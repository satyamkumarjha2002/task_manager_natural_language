'use client';

import { useState, useEffect } from 'react';
import { extractTasksFromQuery } from '@/lib/utils';
import { saveTasksToFirestore, getUserTasks, updateTask, deleteTask } from '@/lib/firestore';
import { ExtractedTask, Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Sparkles, FileText, Users, Calendar, Flag, LogOut, User, Edit2, CheckCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { EditTaskDialog } from '@/components/EditTaskDialog';
import { EditExtractedTaskDialog } from '@/components/EditExtractedTaskDialog';

export default function Home() {
  const [meetingMinutes, setMeetingMinutes] = useState('');
  const [extractedTasks, setExtractedTasks] = useState<ExtractedTask[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  
  // Edit task state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Edit extracted task state
  const [editingExtractedTask, setEditingExtractedTask] = useState<ExtractedTask | null>(null);
  const [editingExtractedTaskIndex, setEditingExtractedTaskIndex] = useState<number | null>(null);
  const [isEditExtractedDialogOpen, setIsEditExtractedDialogOpen] = useState(false);
  
  // Delete confirmation state
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [extractedTaskToDelete, setExtractedTaskToDelete] = useState<{ task: ExtractedTask; index: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteExtractedAlert, setShowDeleteExtractedAlert] = useState(false);
  
  const { user, loading, logout, isAuthenticated } = useAuth();

  // Load user's existing tasks when user is available
  useEffect(() => {
    if (user && isAuthenticated) {
      loadUserTasks();
    }
  }, [user, isAuthenticated]);

  const loadUserTasks = async () => {
    if (!user) return;
    
    setIsLoadingTasks(true);
    try {
      console.log('Loading tasks for user:', user.uid);
      const tasks = await getUserTasks(user.uid);
      console.log('Loaded tasks:', tasks);
      setAllTasks(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleExtractTasks = async () => {
    setIsExtracting(true);
    try {
      const tasks = await extractTasksFromQuery(meetingMinutes);
      setExtractedTasks(tasks);
    } catch (error) {
      console.error('Error extracting tasks:', error);
      // Set empty array or show error message
      setExtractedTasks([]);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveTasks = async () => {
    if (!user || extractedTasks.length === 0) return;
    
    setIsSaving(true);
    try {
      console.log('Saving tasks for user:', user.uid);
      const savedTasks = await saveTasksToFirestore(extractedTasks, user.uid);
      console.log('Saved tasks:', savedTasks);
      setAllTasks(prev => [...savedTasks, ...prev]);
      setExtractedTasks([]);
      setMeetingMinutes('');
    } catch (error) {
      console.error('Error saving tasks:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTask = async (taskId: string, updatedData: Partial<Task>) => {
    try {
      await updateTask(taskId, updatedData);
      
      // Update the task in local state
      setAllTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, ...updatedData }
            : task
        )
      );
      
      console.log('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteAlert(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      
      // Remove the task from local state
      setAllTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
      
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
      setTaskToDelete(null);
    }
  };

  const handleEditExtractedTask = (task: ExtractedTask, index: number) => {
    setEditingExtractedTask(task);
    setEditingExtractedTaskIndex(index);
    setIsEditExtractedDialogOpen(true);
  };

  const handleUpdateExtractedTask = (taskIndex: number, updatedTask: ExtractedTask) => {
    setExtractedTasks(prev => 
      prev.map((task, index) => 
        index === taskIndex ? updatedTask : task
      )
    );
  };

  const handleDeleteExtractedTask = (task: ExtractedTask, index: number) => {
    setExtractedTaskToDelete({ task, index });
    setShowDeleteExtractedAlert(true);
  };

  const confirmDeleteExtractedTask = () => {
    if (!extractedTaskToDelete) return;
    
    setExtractedTasks(prev => prev.filter((_, index) => index !== extractedTaskToDelete.index));
    setShowDeleteExtractedAlert(false);
    setExtractedTaskToDelete(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'destructive';
      case 'P2': return 'secondary';
      case 'P3': return 'outline';
      default: return 'outline';
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect is handled by useAuth)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              AI Meeting Minutes to Task Converter
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Transform your meeting minutes into actionable tasks with AI
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <User className="w-5 h-5" />
              <span>{user?.email}</span>
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm dark:bg-slate-800/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Meeting Minutes Input
              </CardTitle>
              <CardDescription>
                Paste your meeting transcript and let AI extract tasks automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: 'Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight.'"
                value={meetingMinutes}
                onChange={(e) => setMeetingMinutes(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <Button 
                onClick={handleExtractTasks} 
                disabled={!meetingMinutes.trim() || isExtracting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                {isExtracting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Extracting Tasks...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Extract Tasks with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm dark:bg-slate-800/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Task Summary
                {isLoadingTasks && (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin ml-2" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{allTasks.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {allTasks.filter(t => t.completed).length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {allTasks.filter(t => t.priority === 'P1').length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">High Priority</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Extracted Tasks Preview */}
        {extractedTasks.length > 0 && (
          <Card className="mt-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm dark:bg-slate-800/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Newly Extracted Tasks
              </CardTitle>
              <CardDescription>
                Review and edit extracted tasks before saving it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Description</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Due Date/Time</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extractedTasks.map((task, index) => (
                    <TableRow key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                      <TableCell className="font-medium">{task.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {task.assignee.charAt(0).toUpperCase()}
                          </div>
                          {task.assignee}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          {task.deadline}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(task.priority) as any}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditExtractedTask(task, index)}
                            className="flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteExtractedTask(task, index)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={handleSaveTasks}
                  disabled={isSaving || extractedTasks.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    `Save ${extractedTasks.length} Tasks`
                  )}
                </Button>
                <Button 
                  onClick={() => setExtractedTasks([])}
                  variant="outline"
                >
                  Discard All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Tasks Display */}
        {allTasks.length > 0 && (
          <Card className="mt-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm dark:bg-slate-800/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5" />
                Your Tasks ({allTasks.length})
                <Button 
                  onClick={loadUserTasks}
                  variant="outline"
                  size="sm"
                  disabled={isLoadingTasks}
                  className="ml-auto"
                >
                  {isLoadingTasks ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </Button>
              </CardTitle>
              <CardDescription>
                All tasks saved in your database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Task Description</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Due Date/Time</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allTasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                      <TableCell>
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-slate-300 rounded-full"></div>
                        )}
                      </TableCell>
                      <TableCell className={`font-medium ${task.completed ? 'line-through text-slate-500' : ''}`}>
                        {task.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {task.assignee.charAt(0).toUpperCase()}
                          </div>
                          {task.assignee}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          {task.deadline}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(task.priority) as any}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {task.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTask(task)}
                            className="flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTask(task)}
                            disabled={isDeleting}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Empty State for New Users */}
        {allTasks.length === 0 && extractedTasks.length === 0 && !isLoadingTasks && (
          <Card className="mt-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm dark:bg-slate-800/70">
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                No tasks yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Start by adding some meeting minutes to extract your first tasks!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State for Tasks */}
        {isLoadingTasks && allTasks.length === 0 && (
          <Card className="mt-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm dark:bg-slate-800/70">
            <CardContent className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                Loading your tasks...
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Please wait while we fetch your saved tasks.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Edit Task Dialog */}
        <EditTaskDialog
          task={editingTask}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleUpdateTask}
        />

        {/* Edit Extracted Task Dialog */}
        <EditExtractedTaskDialog
          task={editingExtractedTask}
          taskIndex={editingExtractedTaskIndex}
          open={isEditExtractedDialogOpen}
          onOpenChange={setIsEditExtractedDialogOpen}
          onSave={handleUpdateExtractedTask}
        />

        {/* Delete Task Confirmation Dialog */}
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the task "{taskToDelete?.description}"? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteTask}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Extracted Task Confirmation Dialog */}
        <AlertDialog open={showDeleteExtractedAlert} onOpenChange={setShowDeleteExtractedAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove the task "{extractedTaskToDelete?.task.description}" from the preview? 
                This will not affect any saved tasks.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteExtractedTask}
                className="bg-red-600 hover:bg-red-700"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
