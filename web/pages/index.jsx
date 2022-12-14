import Head from "next/head";
import { useEffect, useState } from "react";
import AddTodoForm from "../components/add-todo-form";
import { classNames } from "../utils/classnames";
import { API_URL } from "../utils/constants";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [select, setSelect] = useState("all");

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/todos`)
      .then((response) => response.json())
      .then((todos) => {
        if (todos.length !== 0) {
          todos = todos.slice(0, 50);
          setTodos(todos);
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  if (isLoading) {
    return <div className="center-page">Loading...</div>;
  }

  if (error !== null) {
    return <div className="center-page">{error}</div>;
  }

  const handleDelete = (id) => {
    fetch(`${API_URL}/todos/${id}`, { method: "DELETE" })
      .then(() => {
        const filteredTodos = todos.filter((todo) => todo.id !== id);
        setTodos(filteredTodos);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const toggleTodoCompletion = (todo) => {
    fetch(`${API_URL}/todos/${todo.id}`, {
      method: "PATCH",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then(() => {
        const newTodos = todos.map((t) => (t.id === todo.id ? { ...todo } : t));
        setTodos(newTodos);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const onNewTodoCreation = (todo) => {
    const newTodos = [todo, ...todos];
    setTodos(newTodos);
  };

  const handleOnSelect = (e) => {
    setSelect(e.target.value);
    setIsLoading(true);
    fetch(`${API_URL}/todos`)
      .then((response) => response.json())
      .then((todos) => {
        if (todos.length !== 0) {
          todos = todos.slice(0, 50);
          switch (e.target.value) {
            case "incomplete":
              const incompleteTodos = todos.filter(
                (todo) => todo.completed === false
              );
              setTodos(incompleteTodos);
              break;
            case "complete":
              const completedTodos = todos.filter(
                (todo) => todo.completed === true
              );
              setTodos(completedTodos);
              break;

            default:
              setTodos(todos);
              break;
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="container">
      <Head>
        <title>To-Do List</title>
        <meta name="description" content="Created by Saheb" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="app">
        <header>
          <h1 className="logo">To-Do List</h1>
        </header>
        <main className="container">
          <AddTodoForm onNewTodoCreation={onNewTodoCreation} />
          <div className="list-title-container">
            <p className="text-md list-title">Added task in to-do list</p>
            <select
              name="filter"
              className="select"
              value={select}
              onChange={handleOnSelect}
            >
              <option value="all">All</option>
              <option value="incomplete">Incomplete</option>
              <option value="complete">Completed</option>
            </select>
          </div>
          <div>
            <ol className="grid">
              {todos.map((todo) => (
                <li key={todo.id}>
                  <div
                    className={classNames(
                      "card",
                      todo.completed && "completed"
                    )}
                  >
                    <div className="card--header">
                      <h2 className="card--title">{todo.title}</h2>
                      {todo.completed && (
                        <span className="status">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            role="img"
                            preserveAspectRatio="xMidYMid meet"
                            viewBox="0 0 48 48"
                          >
                            <g
                              fill="none"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            >
                              <path
                                fill="var(--green)"
                                d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"
                              />
                              <path
                                stroke="#fff"
                                strokeLinecap="round"
                                d="M16 24L22 30L34 18"
                              />
                            </g>
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="card--footer">
                      {todo.completed ? (
                        <button
                          className="btn secondary pl-0"
                          onClick={() =>
                            toggleTodoCompletion({ ...todo, completed: false })
                          }
                        >
                          Mark as incomplete
                        </button>
                      ) : (
                        <button
                          className="btn primary"
                          onClick={() =>
                            toggleTodoCompletion({ ...todo, completed: true })
                          }
                        >
                          Mark as complete
                        </button>
                      )}
                      <button
                        className="btn secondary"
                        onClick={() => handleDelete(todo.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
