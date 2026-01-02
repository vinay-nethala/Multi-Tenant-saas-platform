import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { projectApi, taskApi, Project, Task } from '@/lib/api';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  ListTodo,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes] = await Promise.all([
          projectApi.list({ limit: 5 })
        ]);
        
        if (projectsRes.success && projectsRes.data) {
          setProjects(projectsRes.data.projects);
          
          // Fetch tasks for each project and filter by current user
          if (projectsRes.data.projects.length > 0 && user) {
            const allTasks: Task[] = [];
            for (const project of projectsRes.data.projects.slice(0, 3)) {
              try {
                const tasksRes = await taskApi.list(project.id);
                if (tasksRes.success && tasksRes.data) {
                  const userTasks = tasksRes.data.tasks.filter(task => {
                    const assignedTo = task.assignedTo;
                    if (typeof assignedTo === 'object' && assignedTo?.id) {
                      return assignedTo.id === user.id;
                    }
                    return assignedTo === user.id;
                  });
                  allTasks.push(...userTasks);
                }
              } catch (err) {
                console.error('Error fetching tasks:', err);
              }
            }
            setMyTasks(allTasks);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const stats = {
    totalProjects: projects.length,
    totalTasks: myTasks.length,
    completedTasks: myTasks.filter(t => t.status === 'completed').length,
    pendingTasks: myTasks.filter(t => t.status !== 'completed').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'completed': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'archived': return 'bg-muted text-muted-foreground';
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

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600';
      case 'in_progress': return 'bg-blue-500/10 text-blue-600';
      case 'todo': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.fullName}!</h1>
        <p className="text-muted-foreground">Here's an overview of your workspace</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your latest projects</CardDescription>
            </div>
            <Link to="/projects">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <FolderKanban className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>No projects yet</p>
                <Link to="/projects">
                  <Button variant="link" className="mt-2">Create your first project</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map(project => (
                  <Link 
                    key={project.id} 
                    to={`/projects/${project.id}`}
                    className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FolderKanban className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {project.taskCount || 0} tasks
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn(getStatusColor(project.status))}>
                        {project.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>Tasks assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            {myTasks.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <ListTodo className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>No tasks assigned to you</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myTasks.slice(0, 5).map(task => (
                  <div 
                    key={task.id}
                    className="p-3 rounded-lg border"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={cn('text-xs', getTaskStatusColor(task.status))}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="secondary" className={cn('text-xs', getPriorityColor(task.priority))}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
