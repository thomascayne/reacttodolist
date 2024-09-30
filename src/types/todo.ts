// src\types\todo.ts
/**
 * Priority type for todo p1 to p4
 */
export type Priority = "p1" | "p2" | "p3" | "p4";

export interface TodoItem {
    completed: boolean;
    createdAt: Date;
    id: number;
    name: string;
    priority: Priority;
    updatedAt: Date;
}

export interface TodoState {
    filter: 'all' | 'active' | 'completed';
    sort: 'priority' | 'createdAt' | 'name';
    entities: Record<string, TodoItem>;
    ids: number[];
    nextId: number;
}
