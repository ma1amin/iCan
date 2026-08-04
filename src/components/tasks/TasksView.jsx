import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { Input, Select } from '../common/Form';
import TaskForm from './TaskForm';
import KanbanBoard from './KanbanBoard';
import { TASK_STATUS, TASK_PRIORITY, TASK_CATEGORIES, TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TASK_CATEGORY_LABELS } from '../../types/tasks';
import './TasksView.css';

const TasksView = () => {
  const { tasks, contacts, addTask, updateTask, deleteTask } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactFilter, setContactFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...TASK_STATUS.map(status => ({ value: status, label: TASK_STATUS_LABELS[status] }))
  ];
  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    ...TASK_PRIORITY.map(priority => ({ value: priority, label: TASK_PRIORITY_LABELS[priority] }))
  ];
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...TASK_CATEGORIES.map(category => ({ value: category, label: TASK_CATEGORY_LABELS[category] }))
  ];
  const contactOptions = [
    { value: 'all', label: 'All Contacts' },
    ...contacts.map(c => ({ value: c.id, label: c.name }))
  ];

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)));
      
      const matchesContact = contactFilter === 'all' || task.contactId === contactFilter;
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
      
      return matchesSearch && matchesContact && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tasks, searchQuery, contactFilter, statusFilter, priorityFilter, categoryFilter]);

  const handleSaveTask = async (taskData) => {
    let result;
    if (selectedTask) {
      result = await updateTask(selectedTask.id, taskData);
    } else {
      result = await addTask(taskData);
    }
    
    if (result.success) {
      setIsFormOpen(false);
      setSelectedTask(null);
    } else {
      alert(`Failed to save task: ${result.error}`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(taskId);
      if (result.success) {
        setIsFormOpen(false);
        setSelectedTask(null);
      } else {
        alert(`Failed to delete task: ${result.error}`);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;
    
    return { total, done, inProgress, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="tasks-view">
      <div className="tasks-header">
        <div className="tasks-stats">
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">In Progress</span>
            <span className="stat-value stat-in-progress">{stats.inProgress}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Done</span>
            <span className="stat-value stat-done">{stats.done}</span>
          </div>
          {stats.overdue > 0 && (
            <div className="stat-item">
              <span className="stat-label">Overdue</span>
              <span className="stat-value stat-overdue">{stats.overdue}</span>
            </div>
          )}
        </div>
        <Button variant="primary" onClick={() => {
          setSelectedTask(null);
          setIsFormOpen(true);
        }} icon="➕">
          New Task
        </Button>
      </div>

      <div className="tasks-filters">
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={setSearchQuery}
          icon="🔍"
        />
        <Select
          value={contactFilter}
          onChange={setContactFilter}
          options={contactOptions}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
        />
        <Select
          value={priorityFilter}
          onChange={setPriorityFilter}
          options={priorityOptions}
        />
        <Select
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categoryOptions}
        />
      </div>

      {filteredTasks.length === 0 ? (
        <Card padding="large" className="tasks-empty">
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>{tasks.length === 0 ? 'Create your first task to get started.' : 'Try adjusting your search or filters.'}</p>
          </div>
        </Card>
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          onTaskUpdate={async (taskId, taskData) => {
            const result = await updateTask(taskId, taskData);
            if (!result.success) {
              alert(`Failed to update task: ${result.error}`);
            }
          }}
          onTaskDelete={async (taskId) => {
            const result = await deleteTask(taskId);
            if (!result.success) {
              alert(`Failed to delete task: ${result.error}`);
            }
          }}
        />
      )}

      {isFormOpen && (
        <TaskForm
          task={selectedTask}
          contactId={null}
          onClose={handleFormClose}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default TasksView;
