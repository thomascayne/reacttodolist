// src/store/todo.selectors.ts

import { selectAllEntities } from "@ngneat/elf-entities";
import { filter, map } from "rxjs/operators";

import { TodoItem } from "../types/todo";
import { todoStore } from "./todo.store";

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
            // compare the priority of the two todos
            // lower priority number means higher impotance - that is, 1 is more important than 4
            const comparison = a.priority - b.priority;

            // using ternary will yield the following
            // if sorting in ascending order (1 to 4), return the comparison as is
            // if sorting in descending order 94 to 1), negate the comparison with "-"
    
            return sort.direction === 'asc' ? comparison : -comparison;
        })
    })
)
