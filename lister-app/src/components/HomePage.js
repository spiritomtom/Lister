import React, { useState, useEffect } from 'react';
import { getWorkItems, createWorkItem, getClients, updateWorkItem, deleteWorkItem, logout } from '../api';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

// Required for accessibility
Modal.setAppElement('#root');

const HomePage = () => {
  const [boards, setBoards] = useState([
    { id: '0', name: 'To Do', items: [] },
    { id: '1', name: 'In Progress', items: [] },
    { id: '2', name: 'Done', items: [] },
  ]);

  const [clients, setClients] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedClientId, setAssignedClientId] = useState('');
  const [status, setStatus] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedWorkItem, setSelectedWorkItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkItems = async () => {
      const data = await getWorkItems();
      const toDoItems = data.filter((item) => item.status === 0);
      const inProgressItems = data.filter((item) => item.status === 1);
      const doneItems = data.filter((item) => item.status === 2);
      setBoards([
        { id: '0', name: 'To Do', items: toDoItems },
        { id: '1', name: 'In Progress', items: inProgressItems },
        { id: '2', name: 'Done', items: doneItems },
      ]);
    };

    const fetchClients = async () => {
      const data = await getClients();
      setClients(data);
    };

    fetchWorkItems();
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newWorkItem = {
      title,
      description,
      assignedClientId,
      status,
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
    };

    try {
      const createdWorkItem = await createWorkItem(newWorkItem);
      setBoards((prevBoards) => {
        const updatedBoard = prevBoards.map((board) => {
          if (board.id === '0') {
            return {
              ...board,
              items: [...board.items, createdWorkItem],
            };
          }
          return board;
        });
        return updatedBoard;
      });
      setTitle('');
      setDescription('');
      setAssignedClientId('');
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error creating work item: ', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (status === 3) {
      try {
        await deleteWorkItem(selectedWorkItem.id);

        setBoards((prevBoards) => {
          return prevBoards.map((board) => ({
            ...board,
            items: board.items.filter((item) => item.id !== selectedWorkItem.id),
          }));
        });
        setEditModalIsOpen(false);
      } catch (error) {
        console.error('Error deleting work item: ', error);
      }
      return;
    }

    const updatedWorkItem = {
      ...selectedWorkItem,
      assignedClientId,
      status,
      dateUpdated: new Date().toISOString(),
    };

    try {
      await updateWorkItem(selectedWorkItem.id, updatedWorkItem);
      
      setBoards((prevBoards) => {
        let updatedBoards = prevBoards.map(board => ({
          ...board,
          items: board.items.filter(item => item.id !== selectedWorkItem.id)
        }));
      
        const newBoard = updatedBoards.find(board => board.id === String(updatedWorkItem.status));
        newBoard.items.push(updatedWorkItem);
      
        return updatedBoards;
      });
      
      setEditModalIsOpen(false);
      } catch (error) {
        console.error('Error updating work item: ', error);
      }
      };
      
      const handleItemClick = (item) => {
        setSelectedWorkItem(item);
        setAssignedClientId(item.assignedClientId);
        setStatus(item.status);
        setEditModalIsOpen(true);
      };
      
      const handleLogout = async () => {
        try {
          await logout();
          alert("Logout successful!");
          navigate('/login');
        } catch (error) {
          console.error("Error logging out: ", error);
        }
      };
      
      return (
        <div className="home-page">
          <h1>Boards</h1>
          <div className="header">
            <button onClick={() => setModalIsOpen(true)} className="open-modal-button">
              Create Work Item
            </button>
            <div className="user-info">
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Create Work Item"
            className="modal"
            overlayClassName="overlay"
          >
            <h2>Create Work Item</h2>
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
                <label>Assigned Client:</label>
                <select
                  value={assignedClientId}
                  onChange={(e) => setAssignedClientId(e.target.value)}
                  required
                >
                  <option value="">Select Client</option>
                  {clients.map(client => (
                    <option key={client.clientId} value={client.clientId}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(parseInt(e.target.value, 10))}
                  required
                >
                  <option value={0}>To Do</option>
                  <option value={1}>In Progress</option>
                  <option value={2}>Done</option>
                </select>
              </div>
              <button type="submit" className="submit-button">
                Create Task
              </button>
            </form>
            <button
              onClick={() => setModalIsOpen(false)}
              className="close-modal-button"
            >
              Close
            </button>
          </Modal>
      
          <Modal
            isOpen={editModalIsOpen}
            onRequestClose={() => setEditModalIsOpen(false)}
            contentLabel="Edit Work Item"
            className="modal"
            overlayClassName="overlay"
          >
            <h2>Edit Work Item</h2>
            <form onSubmit={handleEditSubmit}>
              <div>
                <label>Assigned Client:</label>
                <select
                  value={assignedClientId}
                  onChange={(e) => setAssignedClientId(e.target.value)}
                  required
                >
                              <option value="">Select Client</option>
            {clients.map(client => (
              <option key={client.clientId} value={client.clientId}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(parseInt(e.target.value, 10))}
            required
          >
            <option value={0}>To Do</option>
            <option value={1}>In Progress</option>
            <option value={2}>Done</option>
            <option value={3}>Delete</option>
          </select>
        </div>
        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
      <button
        onClick={() => setEditModalIsOpen(false)}
        className="close-modal-button"
      >
        Close
      </button>
    </Modal>

    <div className="boards-container">
      {boards.map(board => (
        <div className="board" key={board.id}>
          <h2>{board.name}</h2>
          <div className="items-container">
            {board.items.map(item => (
              <div
                className="item"
                key={item.id}
                onClick={() => handleItemClick(item)}
              >
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