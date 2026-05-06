import { useState } from "react";
import axios from "axios";

const API = "https://task-manager-backend-production-3424.up.railway.app";
console.log("API URL:", API);

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔐 LOGIN
  const login = async () => {
    try {
      const res = await axios.post(`${API}/api/login`, {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      alert("Login Successful");

    } catch (err) {
      alert("Login Failed: " + (err.response?.data || err.message));
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("Logged out");
  };

  // 📁 GET PROJECTS
  const getProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/projects`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      setProjects(res.data);

    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  // ➕ CREATE PROJECT
  const createProject = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/api/create-project`,
        { name: projectName },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      alert("Project created");
      getProjects();

    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  // ➕ CREATE TASK
  const createTask = async () => {
    try {
      const token = localStorage.getItem("token");

      if (projects.length === 0) {
        alert("Create a project first");
        return;
      }

      await axios.post(
        `${API}/api/create-task`,
        {
          title: taskTitle,
          project: projects[0]._id
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      alert("Task created");
      setTaskTitle("");
      getTasks();

    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  // 📋 GET TASKS
  const getTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/tasks`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      setTasks(res.data);

    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  return (
    <div>
      {!isLoggedIn ? (

        // 🔐 LOGIN UI
        <div style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to right, #4facfe, #00f2fe)"
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            width: "300px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}>
            <h2 style={{ textAlign: "center" }}>Login</h2>

            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <button
              onClick={login}
              style={{
                width: "100%",
                padding: "10px",
                background: "#4facfe",
                color: "white",
                border: "none",
                borderRadius: "5px"
              }}
            >
              Login
            </button>
          </div>
        </div>

      ) : (

        // 🌈 DASHBOARD
        <div style={{
          minHeight: "100vh",
          padding: "20px",
          background: "linear-gradient(to right, #667eea, #764ba2)",
          color: "white"
        }}>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h1>Dashboard</h1>

            <button onClick={logout}
              style={{
                padding: "8px 15px",
                background: "#ff4d4d",
                color: "white",
                border: "none",
                borderRadius: "5px"
              }}>
              Logout
            </button>
          </div>

          {/* PROJECTS */}
          <div style={{
            background: "white",
            color: "black",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px"
          }}>
            <h3>Projects</h3>

            <input
              placeholder="Project Name"
              onChange={(e) => setProjectName(e.target.value)}
              style={{ padding: "10px", marginRight: "10px" }}
            />

            <button onClick={createProject}>Create</button>
            <button onClick={getProjects} style={{ marginLeft: "10px" }}>
              Refresh
            </button>

            {projects.map((p) => (
              <div key={p._id} style={{ padding: "10px", marginTop: "10px" }}>
                {p.name}
              </div>
            ))}
          </div>

          {/* TASKS */}
          <div style={{
            background: "white",
            color: "black",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px"
          }}>
            <h3>Tasks</h3>

            <input
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              style={{ padding: "10px", marginRight: "10px" }}
            />

            <button onClick={createTask}>Create</button>
            <button onClick={getTasks} style={{ marginLeft: "10px" }}>
              Refresh
            </button>

            {tasks.map((t) => (
              <div key={t._id} style={{ padding: "10px", marginTop: "10px" }}>
                <b>{t.title}</b> - {t.status}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

export default App;