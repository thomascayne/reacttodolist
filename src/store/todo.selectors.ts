// src/store/todo.selectors.ts

import { selectAllEntities } from "@ngneat/elf-entities";
import { todoStore } from "./todo.store";
import { filter, map } from "rxjs/operators";
import { TodoItem } from "../types/todo";

export const selectTodos = todoStore.pipe(selectAllEntities());

export const selectVisibleTodos = todoStore.pipe(
    selectAllEntities(),
    filter((todos): todos is TodoItem[] => Array.isArray(todos)),
    map((todos: TodoItem[]) => {
        const state = todoStore.getValue();
        const filter = state.filter;
        const sort = state.sort;

        let filteredTodos = todos;

        if (filter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (filter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }

        return filteredTodos.sort((a, b) => {
            if (sort === 'priority') {
                return a.priority.localeCompare(b.priority)
            } else if (sort === 'createdAt') {
                return b.createdAt.getTime() - a.createdAt.getTime();
            } else {
                return a.name.localeCompare(b.name);
            }
        })
    })
)
