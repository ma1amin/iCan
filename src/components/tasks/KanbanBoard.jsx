import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAppContext } from '../../context/AppContext';
import { TASK_STATUS, TASK_STATUS_LABELS, TASK_STATUS_COLORS, TASK_PRIORITY_COLORS, TASK_PRIORITY_LABELS } from '../../types/tasks';
import TaskForm from './TaskForm';
import './KanbanBoard.css';

const KanbanBoard = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  const { contacts } = useAppContext();
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleStatusChange = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onTaskUpdate(taskId, { ...task, status: newStatus });
    }
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the board
    if (!destination) {
      return;
    }

    // Dropped in the same column
    if (destination.droppableId === source.droppableId) {
      return;
    }

    // Get the task
    const task = tasks.find(t => t.id === draggableId);
    if (task) {
      // Update task status to match the destination column
      onTaskUpdate(draggableId, { ...task, status: destination.droppableId });
    }
  };

  const handleSaveTask = (taskData) => {
    onTaskUpdate(taskData.id, taskData);
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onTaskDelete(taskId);
      setIsFormOpen(false);
      setSelectedTask(null);
    }
  };

  const getContact = (contactId) => {
    return contacts.find(c => c.id === contactId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = date - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days <= 7) return `${days} days`;
    return date.toLocaleDateString();
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {TASK_STATUS.map(status => {
            const statusTasks = tasks.filter(task => task.status === status);
            return (
              <Droppable key={status} droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`kanban-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                  >
                    <div 
                      className="kanban-column-header"
                      style={{ 
                        backgroundColor: TASK_STATUS_COLORS[status] + '22',
                        color: TASK_STATUS_COLORS[status]
                      }}
                    >
                      <h3 className="kanban-column-title">{TASK_STATUS_LABELS[status]}</h3>
                      <span className="kanban-column-count">{statusTasks.length}</span>
                    </div>
                    <div className="kanban-column-tasks">
                      {statusTasks.length === 0 ? (
                        <div className="kanban-empty">
                          <span>No tasks</span>
                        </div>
                      ) : (
                        statusTasks.map((task, index) => {
                          const contact = getContact(task.contactId);
                          return (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`kanban-task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                  onClick={() => handleTaskClick(task)}
                                >
                                  <div className="task-card-header">
                                    <div 
                                      className="task-priority-indicator"
                                      style={{ backgroundColor: TASK_PRIORITY_COLORS[task.priority] }}
                                    />
                                    <span className="task-priority-label">{TASK_PRIORITY_LABELS[task.priority]}</span>
                                  </div>
                                  <h4 className="task-card-title">{task.title}</h4>
                                  {task.description && (
                                    <p className="task-card-description">{task.description}</p>
                                  )}
                                  <div className="task-card-meta">
                                    {contact && (
                                      <div className="task-card-contact">{contact.name}</div>
                                    )}
                                    {task.dueDate && (
                                      <div 
                                        className={`task-card-due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}
                                      >
                                        {formatDate(task.dueDate)}
                                      </div>
                                    )}
                                    {task.category && (
                                      <div className="task-card-category">{task.category}</div>
                                    )}
                                  </div>
                                  {task.tags && task.tags.length > 0 && (
                                    <div className="task-card-tags">
                                      {task.tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} className="task-tag">{tag}</span>
                                      ))}
                                      {task.tags.length > 3 && (
                                        <span className="task-tag">+{task.tags.length - 3}</span>
                                      )}
                                    </div>
                                  )}
                                  <div className="task-card-actions">
                                    <select
                                      className="task-status-select"
                                      value={task.status}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange(task.id, e.target.value);
                                      }}
                                    >
                                      {TASK_STATUS.map(s => (
                                        <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {isFormOpen && (
        <TaskForm
          task={selectedTask}
          contactId={null}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedTask(null);
          }}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </>
  );
};

KanbanBoard.propTypes = {
  tasks: PropTypes.array.isRequired,
  onTaskUpdate: PropTypes.func.isRequired,
  onTaskDelete: PropTypes.func.isRequired
};

export default KanbanBoard;