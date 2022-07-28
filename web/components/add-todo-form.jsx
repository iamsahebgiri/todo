import React, { useState } from "react";
import { API_URL } from "../utils/constants";

export default function AddTodoForm({ onNewTodoCreation }) {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // prevent users from clicking multiple time
          if (isLoading) return;

          // check if title is empty
          if (title.length === 0) {
            setError("Title can't be empty!");
            return;
          }

          setIsLoading(true);
          setError(null);
          fetch(`${API_URL}/todos`, {
            method: "POST",
            body: JSON.stringify({
              title,
              completed: false,
              userId: 1,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((todo) => {
              setTitle("");
              onNewTodoCreation(todo);
            })
            .catch((err) => {
              console.log(err);
              setError(err.message);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }}
      >
        <label htmlFor="title" className="text-md   ">
          Add a new task in the list
        </label>
        <div className="form-control">
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Enter the task here"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="submit"
            value={isLoading ? "Loading" : "Submit"}
            className="btn primary"
            disabled={isLoading}
          />
        </div>
        {error ? <span className="text-md error">{error}</span> : null}
      </form>
    </div>
  );
}
