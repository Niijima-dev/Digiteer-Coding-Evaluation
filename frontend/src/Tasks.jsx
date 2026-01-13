import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "./api/axios"

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    api.get('/tasks')
      fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) return;

    try{
      const response = await api.post('/tasks', {title: newTaskTitle});
      setTasks([...tasks, response.data]);
      setNewTaskTitle('')
      setError('')
    }catch(err){
      setError('Failed to create task');
      console.error(err);
    }
  };

  const handleToggleTask = async (task) => {
    try{
      await api.put(`/task/${task.id}`, {
        title: task.title,
        isDone: !task.isDone
      });

      setTasks(task.map(t => t.id == task.id ? {...t, isDone: !t.isDone} : t));
      setError('');
    }catch(err){
      setError('Failed to update task');
      console.error(err);
    }
  };

  const handleStartEdit = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
  };

  const handleSaveEdit = async (task) => {
    if (!editTitle.trim()) return;

    try {
      await api.put(`/tasks/${task.id}`, {
        title: editTitle,
        isDone: task.isDone
      });
      
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, title: editTitle } : t
      ));
      setEditingTask(null);
      setError('');
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className='taskContainer'>
      <div className='taskHeader'>
        <h2>Tasks</h2>
        <div className='headerRow'>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout} className='logoutButton'>
            Logout
          </button>
        </div>
      </div>

      {error && <div className='error'>{error}</div>}

      <form onSubmit={handleCreateTask} className="task-form">
        <input
          type="text"
          placeholder="Enter new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <li className="empty-state">No tasks yet. Create one above!</li>
        ) : (
          tasks.map(task => (
            <li key={task.id} className={`task-item ${task.isDone ? 'done' : ''}`}>
              <input
                type="checkbox"
                checked={task.isDone}
                onChange={() => handleToggleTask(task)}
              />
              
              {editingTask === task.id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => handleSaveEdit(task)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <div className="view-mode">
                  <span className="task-title">{task.title}</span>
                  <div className="task-actions">
                    <button onClick={() => handleStartEdit(task)}>Edit</button>
                    <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>

    </div>


  );
}

export default Tasks;
