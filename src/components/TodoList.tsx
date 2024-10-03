import Add from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Checkbox, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useObservable } from '@ngneat/react-rxjs';
// src\components\TodoList.tsx

import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';

import { useAnalytics } from '../hooks/analytics.hook';
import { addTodo, deleteTodo, updateTodo } from '../store/todo.actions';
import { selectVisibleTodos } from '../store/todo.selectors';
import { TodoItem } from '../types/todo';

const priorityLabels = {
    1: 'Priority 1',
    2: 'Priority 2',
    3: 'Priority 3',
    4: 'Priority 4',
};

export const TodoList: React.FC = () => {
    const [todos] = useObservable(selectVisibleTodos);
    const [newTodoName, setNewTodoName] = useState('');
    const [newTodoPriority, setNewTodoPriority] = useState<number>(1);
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const [editingTodoName, setEditingTodoName] = useState('');
    const editInputRef = useRef<HTMLInputElement>(null)
    const { client: analyticsClient } = useAnalytics();

    useEffect(() => {
        if (editingTodoId !== null && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingTodoId]);

    const handleAddTodo = () => {
        if (newTodoName.trim()) {
            const newTodo = { name: newTodoName.trim(), priority: newTodoPriority, completed: false };

            addTodo(newTodo);

            analyticsClient.capture({
                eventName: "todo_created",
                payload: { todo_name: newTodo.name }
            });

            setNewTodoName('');
            setNewTodoPriority(1);
        }
    };

    const handleDeleteTodo = (id: number) => {
        console.log(id)
        deleteTodo(id);
    };

    const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>, todoId: number) => {
        if (event.key === 'Escape') {
            setEditingTodoId(null);
            setEditingTodoName('');
        } else if (event.key === 'Enter') {
            handleSaveEdit(todoId);
        }
    };

    const handleEditTodo = (todo: TodoItem) => {
        setEditingTodoId(todo.id);
        setEditingTodoName(todo.name);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleAddTodo();
        }
    };

    const handleSaveEdit = (id: number) => {
        updateTodo(id, { name: editingTodoName });
        setEditingTodoId(null);
        setEditingTodoName('');
    };

    const handleToggleTodo = (todo: TodoItem) => {
        const updatedTodo = { ...todo, completed: !todo.completed };
        
        updateTodo(todo.id, updatedTodo);

        if (updatedTodo.completed) {
            analyticsClient.capture({
                eventName: "todo_marked",
                payload: {
                    todo_name: todo.name,
                    priority: todo.priority
                }
            });
        }
    };

    const renderTodoItem = (todo: TodoItem) => (
        <div key={`todo-item-${todo.id}`} className="flex items-center py-2 border-b border-gray-700 last:border-b-0">
            <Checkbox
                aria-label={`Toggle ${todo.name}`}
                checked={todo.completed}
                checkedIcon={
                    <span 
                        className={`w-5 h-5 rounded-full cursor-pointer todo-checkbox priority-${todo.priority}-bg`}
                    />
                }
                data-testid={`todo-checkbox-${todo.id}`}
                icon={
                    <span 
                        className={`w-5 h-5 rounded-full border-2 cursor-pointer todo-checkbox todo-checkbox-unchecked priority-${todo.priority}-border`}
                    />
                }
                name={`todo-checkbox-${todo.id}`}
                onChange={() => handleToggleTodo(todo)}
                role="checkbox"
                tabIndex={0}
                sx={{ padding: 0}}
            />

            <div className="flex-grow ml-4">
                {todo.completed || editingTodoId !== todo.id ? (
                    <Typography
                        sx={{
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            color: todo.completed ? 'text.secondary' : 'text.primary',
                            cursor: !todo.completed ? 'pointer' : 'default'
                        }}
                        onClick={() => !todo.completed && handleEditTodo(todo)}
                    >
                        {todo.name}
                    </Typography>
                ) : (
                    <TextField
                        autoFocus
                        data-testid={`edit-input-${todo.id}`}
                        fullWidth
                        inputRef={editInputRef}
                        onBlur={() => handleSaveEdit(todo.id)}
                        onChange={(e) => setEditingTodoName(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleEditKeyDown(e, todo.id)}
                        role="input"
                        tabIndex={0}
                        value={editingTodoName}
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
            {incompleteTodos && incompleteTodos.length > 0 && (
                <div className="mb-4">
                    {incompleteTodos.map(renderTodoItem)}
                </div>
            )}

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
                    onChange={(e) => setNewTodoPriority(e.target.value as number)}
                    size="small"
                    style={{ minWidth: '120px' }}
                >
                    {Object.entries(priorityLabels).map(([value, label]) => (
                        <MenuItem key={value} value={value}>{label}</MenuItem>
                    ))}
                </Select>
            </div>

            <div className="mb-4">
                <Button
                    color="primary"
                    onClick={handleAddTodo}
                    startIcon={<Add />}
                    variant="contained"
                >
                    <span className="ml-2">Add Task</span>
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
