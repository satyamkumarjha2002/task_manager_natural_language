import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Task, ExtractedTask } from '@/types/task';

// Collection reference
const TASKS_COLLECTION = 'tasks';

/**
 * Add extracted tasks to Firestore
 */
export async function saveTasksToFirestore(extractedTasks: ExtractedTask[], userId: string): Promise<Task[]> {
  const savedTasks: Task[] = [];
  
  for (const extractedTask of extractedTasks) {
    const taskData = {
      ...extractedTask,
      userId,
      createdAt: Timestamp.now(),
      completed: false,
    };
    
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskData);
    
    savedTasks.push({
      id: docRef.id,
      ...extractedTask,
      createdAt: taskData.createdAt.toDate(),
      completed: false,
    });
  }
  
  return savedTasks;
}

/**
 * Update an existing task in Firestore
 */
export async function updateTask(taskId: string, updatedData: Partial<Task>): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  
  // Remove id and createdAt from update data as they shouldn't be updated
  const { id, createdAt, ...updateFields } = updatedData;
  
  await updateDoc(taskRef, updateFields);
}

/**
 * Delete a task from Firestore
 */
export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskRef);
}

/**
 * Get all tasks for a specific user
 */
export async function getUserTasks(userId: string): Promise<Task[]> {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const tasks: Task[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    tasks.push({
      id: doc.id,
      description: data.description,
      assignee: data.assignee,
      deadline: data.deadline,
      priority: data.priority,
      createdAt: data.createdAt.toDate(),
      completed: data.completed,
    });
  });
  
  return tasks;
} 