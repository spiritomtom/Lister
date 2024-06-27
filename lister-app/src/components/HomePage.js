import React, { useState, useEffect } from 'react';
import { getWorkItems, createWorkItem } from '../api'; // Adjust the import paths as needed
import './HomePage.css';

const HomePage = () => {
  const [boards, setBoards] = useState([
    { id: 1, name: "To Do", items: [] },
    { id: 2, name: "In Progress", items: [] },
    { id: 3, name: "Done", items: [] }
  ]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedClientId, setAssignedClientId] = useState(''); // Adjust depending on how clients are handled
  const [status, setStatus] = useState(0); // 0 for To Do, adjust statuses as necessary

  useEffect(() => {
    const fetchWorkItems = async () => {
      const data = await getWorkItems();
      // Sort the work items into the appropriate board
      const toDoItems = data.filter(item => item.status === 0);
      const inProgressItems = data.filter(item => item.status === 1);
      const doneItems = data.filter(item => item.status === 2);
      setBoards([
        { id: 1, name: "To Do", items: toDoItems },
        { id: 2, name: "In Progress", items: inProgressItems },
        { id: 3, name: "Done", items: doneItems }
      ]);
    };

    fetchWorkItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newWorkItem = { title, description, assignedClientId, status };
    const createdWorkItem = await createWorkItem(newWorkItem);
    // Adding the new item to the To Do board
    setBoards((prevBoards) => {
      const updatedBoard = prevBoards.map(board => {
        if (board.id === 1) {
          return {
            ...board,
            items: [...board.items, createdWorkItem]
          };
        }
        return board;
      });
      return updatedBoard;
    });
    // Clear form
    setTitle('');
    setDescription('');
    setAssignedClientId('');
  };

  return (
    <div className="home-page">
      <h1>Boards</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Assigned Client ID:</label>
            <input
              type="text"
              value={assignedClientId}
              onChange={(e) => setAssignedClientId(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(parseInt(e.target.value))} required>
              <option value={0}>To Do</option>
              <option value={1}>In Progress</option>
              <option value={2}>Done</option>
            </select>
          </div>
          <button type="submit">Create Task</button>
        </form>
      </div>
      <div className="boards-container">
        {boards.map(board => (
          <div className="board" key={board.id}>
            <h2>{board.name}</h2>
            <div className="items-container">
              {board.items.map(item => (
                <div className="item" key={item.id}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;