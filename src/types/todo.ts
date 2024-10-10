// src\types\todo.ts
export interface TodoItem {
    completed: boolean;
    createdAt: Date;
    id: number;
    name: string;
    priority: number;
    updatedAt: Date;
}

export type SortDirection = 'asc' | 'desc';

export interface TodoState {
    filter: 'all' | 'active' | 'completed';
    sort: {
        direction: SortDirection
    };
    entities: Record<string, TodoItem>;
    ids: number[];
    nextId: number;
}
