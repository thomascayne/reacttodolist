// src\store\todo.store.ts

import { createStore, withProps } from '@ngneat/elf';
import { withEntities } from '@ngneat/elf-entities';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';

import { TodoItem, TodoState } from '../types/todo';

export type SortDirection = 'asc' | 'desc';

export const todoStore = createStore(
  { name: 'todos' },
  withEntities<TodoItem>(),
  withProps<Omit<TodoState, 'entities' | 'ids'>>({
    filter: 'all',
    sort: {
      direction: 'asc'
    },
    nextId: 1
  })
);
/**
 * Add persist state to the store. No coding needs to be done.
 * The library takes car of it
 */
export const persist = persistState(todoStore, {
  key: 'todos',
  storage: localStorageStrategy,
});
