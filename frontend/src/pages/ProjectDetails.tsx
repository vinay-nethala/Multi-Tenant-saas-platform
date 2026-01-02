import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { projectApi, taskApi, userApi, Project, Task, User, TaskStatus, TaskPriority } from '@/lib/api';
import { 
  Plus, 
  ArrowLeft,
  Pencil,
  Trash2,
  Loader2,
  Calendar,
  CheckCircle2,
  Clock,
  ListTodo,
  MoreHorizontal,
  User as UserIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    assignedTo: '',
    dueDate: ''
  });

  const fetchProjectData = async () => {
    if (!projectId) return;

    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectApi.get(projectId),
        taskApi.list(projectId)
      ]);

      if (projectRes.success && projectRes.data) {
        setProject(projectRes.data);
      }

      if (tasksRes.success && tasksRes.data) {
        setTasks(tasksRes.data.tasks);
      }

      // Fetch users for assignment dropdown
      if (user?.tenantId) {
        const usersRes = await userApi.list(user.tenantId);
        if (usersRes.success && usersRes.data) {
          setUsers(usersRes.data.users);
        }
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load project details'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const handleCreateTask = async () => {
    if (!projectId || !taskForm.title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Task title is required'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await taskApi.create(projectId, {
        title: taskForm.title,
        description: taskForm.description || undefined,
        priority: taskForm.priority,
        assignedTo: taskForm.assignedTo || undefined,
        dueDate: taskForm.dueDate || undefined
      });

      if (response.success) {
        toast({ title: 'Success', description: 'Task created successfully' });
        setIsTaskDialogOpen(false);
        resetTaskForm();
        fetchProjectData();
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create task'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!editTask) return;

    setIsSubmitting(true);
    try {
      const response = await taskApi.update(editTask.id, {
        title: taskForm.title,
        description: taskForm.description || undefined,
        status: taskForm.status,
        priority: taskForm.priority,
        assignedTo: taskForm.assignedTo || null,
        dueDate: taskForm.dueDate || null
      });

      if (response.success) {
        toast({ title: 'Success', description: 'Task updated successfully' });
        setEditTask(null);
        setIsTaskDialogOpen(false);
        resetTaskForm();
        fetchProjectData();
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update task'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      const response = await taskApi.updateStatus(taskId, status);
      if (response.success) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
        toast({ title: 'Success', description: 'Task status updated' });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update status'
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTask) return;

    try {
      const response = await taskApi.delete(deleteTask.id);
      if (response.success) {
        toast({ title: 'Success', description: 'Task deleted successfully' });
        fetchProjectData();
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete task'
      });
    } finally {
      setDeleteTask(null);
    }
  };

  const openEditTaskDialog = (task: Task) => {
    setEditTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assignedTo: typeof task.assignedTo === 'object' ? task.assignedTo?.id || '' : task.assignedTo || '',
      dueDate: task.dueDate || ''
    });
    setIsTaskDialogOpen(true);
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignedTo: '',
      dueDate: ''
    });
    setEditTask(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <ListTodo className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600';
      case 'in_progress': return 'bg-blue-500/10 text-blue-600';
      case 'todo': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'medium': return 'bg-amber-500/10 text-amber-600';
      case 'low': return 'bg-green-500/10 text-green-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredTasks = statusFilter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === statusFilter);

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed')
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium">Project not found</h2>
        <Button variant="link" onClick={() => navigate('/projects')}>
          Back to projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.description || 'No description'}</p>
        </div>
        <Badge variant="outline" className={cn('text-sm', getStatusColor(project.status))}>
          {project.status}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <ListTodo className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">To Do</p>
              <p className="text-2xl font-bold">{tasksByStatus.todo.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{tasksByStatus.in_progress.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{tasksByStatus.completed.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>{tasks.length} total tasks</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            { (user?.role === 'super_admin' || user?.role === 'tenant_admin') && (
              <Button onClick={() => { resetTaskForm(); setIsTaskDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            ) }
          </div>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ListTodo className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>No tasks yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {getStatusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="secondary" className={cn('text-xs', getStatusColor(task.status))}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="secondary" className={cn('text-xs', getPriorityColor(task.priority))}>
                          {task.priority}
                        </Badge>
                        {task.assignedTo && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <UserIcon className="h-3 w-3" />
                            {typeof task.assignedTo === 'object' ? task.assignedTo.fullName : 'Assigned'}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'todo')}>
                        <ListTodo className="mr-2 h-4 w-4" /> Set To Do
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'in_progress')}>
                        <Clock className="mr-2 h-4 w-4" /> Set In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'completed')}>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Set Completed
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openEditTaskDialog(task)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteTask(task)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={(open) => { if (!open) resetTaskForm(); setIsTaskDialogOpen(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
            <DialogDescription>
              {editTask ? 'Update task details' : 'Add a new task to this project'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={taskForm.title}
                onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={taskForm.description}
                onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {editTask && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={taskForm.status}
                    onValueChange={(value) => setTaskForm(prev => ({ ...prev, status: value as TaskStatus }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(value) => setTaskForm(prev => ({ ...prev, priority: value as TaskPriority }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assign To</Label>
              <Select
                value={taskForm.assignedTo}
                onValueChange={(value) => setTaskForm(prev => ({ ...prev, assignedTo: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {users.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetTaskForm(); setIsTaskDialogOpen(false); }}>
              Cancel
            </Button>
            <Button onClick={editTask ? handleUpdateTask : handleCreateTask} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTask} onOpenChange={() => setDeleteTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTask?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectDetails;
