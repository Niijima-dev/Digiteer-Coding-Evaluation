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
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
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

  const filteredTask = tasks.filter(task => {
    if(filter == 'completed') return task.isDone;
    if(filter == 'active') return !task.isDone;
    return true;
  });

  const allCount = tasks.length;
  const completedCount = tasks.filter(t => t.isDone).length;
  const activeCount = tasks.filter(t => !t.isDone).length;

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()){
      setError('Task title cannot be empty (╯°□°)╯︵ ┻━┻');
      return;
    }
      

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
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        isDone: !task.isDone
      });

      setTasks(tasks.map(t => 
        t.id == task.id ? {...t, isDone: !t.isDone} : t));
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
        <h2>Tasks Manager</h2>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout} className='logoutButton'>
            Logout
          </button>
      </div>

      {error && <div className='error'>{error}</div>}

      <form onSubmit={handleCreateTask} className="taskForm">
        <input
          type="text"
          placeholder="Enter new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className='filterContainer'>
        <label htmlFor='filter'>Filter Tasks:</label>
        <select
          id='filter'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='filterSelect'>

              <option value="all">All ({allCount})</option>
              <option value="active">Active ({activeCount})</option>
              <option value="all">completed ({completedCount})</option>

          </select>
      </div>

      <ul className="taskList">
        {filteredTask.length === 0 ? (
          <li className="emptyState">
            {filter === 'all' && 'No tasks yet. Create one above!'}
            {filter === 'active' && 'No active tasks!'}
            {filter === 'completed' && 'No completed tasks yet!'}
          </li>
        ) : (
          filteredTask.map(task => (
            <li key={task.id} className={`taskItem ${task.isDone ? 'done' : ''}`}>
              <input
                type="checkbox"
                checked={task.isDone}
                onChange={() => handleToggleTask(task)}
              />
              
              {editingTask === task.id ? (
                <div className="editMode">
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
                <div className="viewMode">
                  <span className="taskTitle">{task.title}</span>
                  <div className="taskActions">
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
