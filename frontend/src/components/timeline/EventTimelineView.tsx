import { useState } from 'react';
import { TimelineTask } from '@/types/event';
import { CheckSquare, Plus, Calendar, User, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Status } from '@/components/dashboard';

interface EventTimelineViewProps {
  tasks: TimelineTask[];
  onAddTask: (taskName: string, category?: string, deadline?: string) => void;
  onToggleTask: (taskId: string) => void;
}

export function EventTimelineView({
  tasks,
  onAddTask,
  onToggleTask,
}: EventTimelineViewProps) {
  const [newTaskName, setNewTaskName] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-12-10');
  const [newCategory, setNewCategory] = useState('General Milestone');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    onAddTask(newTaskName.trim(), newCategory, newDeadline);
    setNewTaskName('');
  };

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="rounded-2xl border bg-card p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg text-plum font-semibold">
              Event Planning Progress
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedCount} of {tasks.length} milestones completed ({progressPercent}%)
            </p>
          </div>
          <span className="font-display text-2xl font-bold text-navy">
            {progressPercent}%
          </span>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-gold transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add New Milestone Task */}
      <form
        onSubmit={handleCreate}
        className="rounded-2xl border bg-card p-5 shadow-soft space-y-3"
      >
        <h4 className="text-xs font-semibold uppercase tracking-wider text-navy flex items-center gap-1.5">
          <Plus className="size-4 text-gold" />
          Add Planning Milestone / Task
        </h4>
        <div className="grid gap-3 sm:grid-cols-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Task Description:
            </label>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="E.g., Finalize bridal entrance playlist, arrange vintage doli..."
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Target Deadline:
            </label>
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs outline-none focus:border-gold"
            />
          </div>
          <div>
            <Button type="submit" variant="hero" className="w-full h-9 text-xs">
              Add Milestone
            </Button>
          </div>
        </div>
      </form>

      {/* Timeline Tasks List */}
      <div className="rounded-2xl border bg-card p-5 shadow-soft">
        <h4 className="font-display text-base text-plum font-semibold mb-3">
          Wedding Milestones Checklist
        </h4>
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition cursor-pointer ${
                task.status === 'COMPLETED'
                  ? 'bg-secondary/40 text-muted-foreground line-through border-muted'
                  : 'bg-card hover:border-gold/60 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckSquare
                  className={`size-5 shrink-0 ${
                    task.status === 'COMPLETED' ? 'text-success' : 'text-muted-foreground'
                  }`}
                />
                <div>
                  <div className="text-xs sm:text-sm font-medium text-navy">{task.taskName}</div>
                  {task.assignedVendorName && (
                    <div className="text-[11px] text-plum flex items-center gap-1 mt-0.5">
                      <User className="size-3 text-gold" />
                      Assigned Vendor: <strong>{task.assignedVendorName}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {task.deadline && (
                  <span className="text-[11px] text-muted-foreground hidden sm:flex items-center gap-1">
                    <Calendar className="size-3 text-gold" />
                    {task.deadline}
                  </span>
                )}
                <Status
                  s={
                    task.status === 'COMPLETED'
                      ? 'Completed'
                      : task.status === 'IN_PROGRESS'
                      ? 'In Progress'
                      : 'Pending'
                  }
                />
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">
              No milestones created yet. Add your first milestone above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
