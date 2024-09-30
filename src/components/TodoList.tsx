// src\components\TodoList.tsx

import React, { useState, KeyboardEvent } from 'react';
import { useObservable } from '@ngneat/react-rxjs';
import { TextField, Select, MenuItem, Button, IconButton, Typography, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { selectVisibleTodos } from '../store/todo.selectors';
import { addTodo, updateTodo, deleteTodo } from '../store/todo.actions';
import { Priority, TodoItem } from '../types/todo';
import { useAnalytics } from '../hooks/analytics.hook';
import Add from '@mui/icons-material/Add';

const priorityLabels = {
    p1: 'Priority 1',
    p2: 'Priority 2',
    p3: 'Priority 3',
    p4: 'Priority 4',
};

export const TodoList: React.FC = () => {
    const [todos] = useObservable(selectVisibleTodos);
    const [newTodoName, setNewTodoName] = useState('');
    const [newTodoPriority, setNewTodoPriority] = useState<Priority>('p1');
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const { client: analyticsClient } = useAnalytics();

    const getPriorityColor = (priority: Priority) => {
        switch (priority) {
            case 'p2': return 'blue';
            case 'p3': return 'orange';
            case 'p4': return 'red';
            default: return 'gray';
        }
    };

    const handleAddTodo = () => {
        if (newTodoName.trim()) {
            const newTodo = { name: newTodoName.trim(), priority: newTodoPriority, completed: false };
            addTodo(newTodo);
            analyticsClient.capture({
                eventName: "todo_created",
                payload: { todo_name: newTodo.name }
            });
            setNewTodoName('');
            setNewTodoPriority('p1');
            setShowAddTask(false);
        }
    };

    const handleDeleteTodo = (id: number) => {
        deleteTodo(id);
    };

    const handleEditTodo = (id: number, newName: string) => {
        updateTodo(id, { name: newName });
        setEditingTodoId(null);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleAddTodo();
        } else if (event.key === 'Escape') {
            setShowAddTask(false);
        }
    };

    const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>, todoId: number) => {
        if (event.key === 'Escape') {
            setEditingTodoId(null);
        } else if (event.key === 'Enter') {
            const todo = todos.find(t => t.id === todoId);
            if (todo) {
                handleEditTodo(todoId, (event.target as HTMLInputElement).value);
            }
        }
    };

    const handleToggleTodo = (todo: TodoItem) => {
        const updatedTodo = { ...todo, completed: !todo.completed };
        updateTodo(todo.id, updatedTodo);
        if (updatedTodo.completed) {
            analyticsClient.capture({
                eventName: "todo_marked",
                payload: {
                    todo_name: todo.name,
                    priority: Number(todo.priority.slice(1))
                }
            });
        }
    };

    const renderTodoItem = (todo: TodoItem) => (
        <div key={`todo-item-${todo.id}`} className="flex items-center py-2 border-b border-gray-700 last:border-b-0">
            <Checkbox
                aria-label={`Toggle ${todo.name}`}
                checked={todo.completed} 
                checkedIcon={<span className="w-5 h-5 rounded-full border-2 bg-gray-600 cursor-pointer" style={{ borderColor: getPriorityColor(todo.priority) }} />} 
                data-testid={`todo-checkbox-${todo.id}`}
                icon={<span className="w-5 h-5 rounded-full border-2 cursor-pointer" style={{ borderColor: getPriorityColor(todo.priority) }} />} 
                name={`todo-checkbox-${todo.id}`}
                onChange={() => handleToggleTodo(todo)} 
                role="checkbox"
                tabIndex={0}
                sx={{ padding: 0 }} 
            />
            <div className="flex-grow ml-4">
                {todo.completed || editingTodoId !== todo.id ? (
                    <Typography
                        sx={{
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            color: todo.completed ? 'text.secondary' : 'text.primary',
                            cursor: !todo.completed ? 'pointer' : 'default'
                        }}
                        onClick={() => !todo.completed && setEditingTodoId(todo.id)}
                    >
                        {todo.name}
                    </Typography>
                ) : (
                    <TextField
                        autoFocus
                        data-testid={`edit-input-${todo.id}`}
                        fullWidth
                        onBlur={() => setEditingTodoId(null)}
                        onChange={(e) => handleEditTodo(todo.id, e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleEditKeyDown(e, todo.id)}
                        role="input"
                        tabIndex={0}
                        value={todo.name}
                        variant="standard"
                    />
                )}
            </div>
            <IconButton onClick={() => handleDeleteTodo(todo.id)} size="small" aria-label="Delete" data-testid={`delete-button-${todo.id}`}>
                <DeleteIcon />
            </IconButton>
        </div>
    );

    const incompleteTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    return (
        <div className="max-w-md mx-auto p-4">
            {showAddTask && (
                <div className="mb-4 flex items-center gap-4">
                    <TextField
                        className="flex-grow mr-2"
                        data-testid="new-todo-input"
                        onChange={(e) => setNewTodoName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter todo name"
                        size="small"
                        value={newTodoName}
                        variant="outlined"
                    />
                    <Select
                        value={newTodoPriority}
                        onChange={(e) => setNewTodoPriority(e.target.value as Priority)}
                        size="small"
                        style={{ minWidth: '120px' }}
                    >
                        {Object.entries(priorityLabels).map(([value, label]) => (
                            <MenuItem key={value} value={value}>{label}</MenuItem>
                        ))}
                    </Select>
                </div>
            )}

            <div className="mb-4">
                {incompleteTodos.map(renderTodoItem)}
            </div>

            <div className="mb-4">
                <Button
                    onClick={() => setShowAddTask(!showAddTask)}
                    variant="contained"
                    color="primary"

                >
                    <Add /> <span className="ml-2">Add Task</span>
                </Button>
            </div>

            {completedTodos.length > 0 && (
                <div>
                    <Typography variant="h6" gutterBottom>Completed</Typography>
                    {completedTodos.map(renderTodoItem)}
                </div>
            )}
        </div>
    );
};
