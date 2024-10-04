// src\store\todo.store.ts

import { createStore, withProps } from '@ngneat/elf';
import { withEntities } from '@ngneat/elf-entities';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';

import { TodoItem, TodoState } from '../types/todo';

export const todoStore = createStore(
  { name: 'todos' },
  withEntities<TodoItem>(),
  withProps<Omit<TodoState, 'entities' | 'ids'>>({
    filter: 'all',
    sort: 'priority',
    nextId: 1
  })
);

export const persist = persistState(todoStore, {
  key: 'todos',
  storage: localStorageStrategy,
});
