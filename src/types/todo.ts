// src\types\todo.ts
export interface TodoItem {
    completed: boolean;
    createdAt: Date;
    id: number;
    name: string;
    priority: number;
    updatedAt: Date;
}

export interface TodoState {
    filter: 'all' | 'active' | 'completed';
    sort: 'priority' | 'createdAt' | 'name';
    entities: Record<string, TodoItem>;
    ids: number[];
    nextId: number;
}
