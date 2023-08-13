import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTrash, FaEdit } from "react-icons/fa";
import { BsHandThumbsUpFill } from "react-icons/bs"
import "./App.css";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTodoIndex, setEditingTodoIndex] = useState(null);
  const [editedTodoText, setEditedTodoText] = useState("");

  useEffect(() => {
    getLocalTodos();
  }, []);

  useEffect(() => {
    saveLocalTodos(todos);
  }, [todos]);

  const addTodo = (event) => {
    event.preventDefault();
    if (todoInput.trim() === "") return;
    const newTodo = { text: todoInput, completed: false };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setTodoInput("");
  };

  const deleteTodo = (index) => {
    setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const editTodo = (index) => {
    setEditingTodoIndex(index);
    setEditedTodoText(todos[index].text);
    setEditModalOpen(true);
  };

  const saveEditedTodo = () => {
    if (editingTodoIndex !== null && editedTodoText.trim() !== "") {
      const updatedTodos = [...todos];
      updatedTodos[editingTodoIndex].text = editedTodoText;
      setTodos(updatedTodos);
    }
    setEditModalOpen(false);
    setEditingTodoIndex(null);
    setEditedTodoText("");
  };

  const filterTodos = (value) => {
    setFilterOption(value);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filterOption === "all") {
      return true;
    } else if (filterOption === "completed") {
      return todo.completed;
    } else {
      return !todo.completed;
    }
  });

  const saveLocalTodos = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const getLocalTodos = () => {
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  };

  return (
    <div className="App">
      <header>
        <h2>TODO__APP</h2>
      </header>

      <form onSubmit={addTodo} className="form">
        <input
          type="text"
          className="todo-input"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          placeholder="ADD TODO"
        />
        <button className="todo-button" type="submit">
          <BsHandThumbsUpFill className="icon" />
        </button>
      </form>

      <div className="todo-container">
        <ul className="todo-list">
          {filteredTodos.map((todo, index) => (
            <div
              key={index}
              className={`todo ${todo.completed ? "completed" : ""}`}
            >
              <li className="todo-item">{todo.text}</li>
              <button
                className="complete-btn"
                onClick={() => toggleComplete(index)}
              >
                <FaCheckCircle className="icon" />
              </button>
              <button className="edit-btn" onClick={() => editTodo(index)}>
                <FaEdit className="icon" />
              </button>
              <button className="trash-btn" onClick={() => deleteTodo(index)}>
                <FaTrash className="icon" />
              </button>
            </div>
          ))}
        </ul>
      </div>

      <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)}>
        <ModalHeader>
          <h2>Edit Todo</h2>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="text"
                autoComplete="off"
                name="text"
                className="input"
                placeholder="Edit your task..."
                value={editedTodoText}
                onChange={(e) => setEditedTodoText(e.target.value)}
              />
            </Form.Group>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            className="btn-primary"
            onClick={saveEditedTodo}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            className="btn-secondary"
            onClick={() => setEditModalOpen(false)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TodoList;
