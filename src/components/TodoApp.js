import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TodoApp.css";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Fetch Selected Todos (Read first 7 Todos) 
  useEffect(() => {
    axios.get("https://dummyjson.com/todos?limit=7") // Fetch only 7 Todos
      .then((response) => setTodos(response.data.todos))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  // Add Todo (Create)
  const addTodo = () => {
    if (!newTodo.trim()) return;

    const newTask = { todo: newTodo, completed: false, userId: 1 };
    
    axios.post("https://dummyjson.com/todos/add", newTask)
      .then((response) => {
        setTodos([...todos, { ...response.data, id: todos.length + 1 }]); // Adding manually as DummyJSON doesn't store it
        setNewTodo(""); // Clear the input field
      })
      .catch((error) => console.error("Error adding todo:", error));
  };

  // Update Todo (Update)
  const updateTodo = (id) => {
    axios.put(`https://dummyjson.com/todos/${id}`, { todo: editingText })
      .then(() => {
        setTodos(todos.map(todo => (todo.id === id ? { ...todo, todo: editingText } : todo)));
        setEditingId(null);
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  // Delete Todo (Delete)
  const deleteTodo = (id) => {
    axios.delete(`https://dummyjson.com/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch((error) => console.error("Error deleting todo:", error));
  };

   // Toggle completion status
  const toggleCompletion = (id, completed) => {
    axios.patch(`https://dummyjson.com/todos/${id}`, { completed: !completed })
      .then(response => {
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, completed: response.data.completed } : todo
        ));
      })
      .catch(error => console.error("Error updating todo:", error));
  };


  return (
    <div>
      <h2>Todo List</h2>

      {/* Add New Todo */}
      <input 
        type="text" 
        placeholder="Add a new todo..." 
        value={newTodo} 
        onChange={(e) => setNewTodo(e.target.value)} 
      />
      <button onClick={addTodo}>Add</button>

      {/* List Todos */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}style={{ textDecoration: todo.completed ? "line-through" : "none"}}>
            
            {editingId === todo.id ? (
              <div style={{display: "flex", justifySelf: "right", paddingRight: "30px"}}>
                <input 
                  type="text" 
                  value={editingText} 
                  onChange={(e) => setEditingText(e.target.value)} 
                />
                <button onClick={() => updateTodo(todo.id)}>Save</button>
              </div>
             ) : (
              <div id="todo-display">
                <div id="todo-item">
                  {todo.todo}
                </div>
                <div id="todo-button">
                  <button onClick={() => toggleCompletion(todo.id, todo.completed)}>
                    {todo.completed ? "✅" : "❌"}
                  </button>
                  <button onClick={() => { setEditingId(todo.id); setEditingText(todo.todo); }}>Edit</button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
              </div>
             )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;