// src\store\todo.actions.ts

import { addEntities, deleteEntities, setEntities, updateEntities } from "@ngneat/elf-entities";

import { TodoItem, TodoState } from "../types/todo";
import { todoStore } from "./todo.store";

export const addTodo = (todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    todoStore.update((state, context) => {
        const newTodo = {
            ...todo,
            id: state.nextId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return {
            ...addEntities(newTodo)(state, context),
            nextId: state.nextId + 1,
            filter: state.filter,
            sort: state.sort
        };
    });
};

export const deleteTodo = (id: number) => todoStore.update(deleteEntities(id));

export const setFilter = (filter: TodoState['filter']) => todoStore.update((state) => ({ ...state, filter }));

export const setSort = (sort: TodoState['sort']) => todoStore.update((state) => ({ ...state, sort }));

export const setTodos = (todos: TodoItem[]) => todoStore.update(setEntities(todos));

export const updateTodo = (id: number, updates: Partial<TodoItem>) => todoStore.update(updateEntities(id, (todo) => ({ ...todo, ...updates, updatedAt: new Date() })));
