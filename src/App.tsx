// src/App.tsx

import { TodoList } from './components/TodoList'

import './App.css';

function App() {
  return (
    <div className="flex justify-center min-h-screen relative">
      <div className="max-w-lg w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Todo List</h1>
        <TodoList />
      </div>
    </div>
  )
}

export default App
