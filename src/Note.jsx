import React, { useState, useEffect } from 'react';
import './Note.css';
import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Note = () => {
  const [show, setShow] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Active'); // Add status state
  const [employees, setEmployees] = useState([]);
  const [isAdding, setIsAdding] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    fetch('https://employe-server-spby.onrender.com/employees')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleClose = () => {
    setShow(false);
    setUsername('');
    setEmail('');
    setEmployeeId('');
    setStatus('Active'); // Reset status on close
    setIsAdding(true);
  };

  const handleShow = (employee) => {
    if (employee) {
      setEmployeeId(employee.id);
      setUsername(employee.username);
      setEmail(employee.email);
      setStatus(employee.status); // Set status from employee data
      setIsAdding(false);
    } else {
      setEmployeeId('');
      setUsername('');
      setEmail('');
      setStatus('Active'); // Set default status
      setIsAdding(true);
    }
    setShow(true);
  };

  const handleAddEmployee = () => {
    const newEmployee = { username, email, status };
    if (employeeId) newEmployee.id = employeeId;

    fetch('https://employe-server-spby.onrender.com/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee),
    })
      .then(response => response.json())
      .then(data => {
        setEmployees([...employees, data]);
        setAlertMessage('Employee added successfully!');
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);
        handleClose();
      })
      .catch(error => console.error('Error adding employee:', error));
  };

  const handleEditEmployee = () => {
    const updatedEmployee = { username, email, status };

    fetch(`https://employe-server-spby.onrender.com/employees/${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEmployee),
    })
      .then(response => response.json())
      .then(data => {
        setEmployees(employees.map(employee => 
          employee.id === employeeId ? data : employee
        ));
        handleClose();
      })
      .catch(error => console.error('Error editing employee:', error));
  };

  const handleDeleteEmployee = (id) => {
    fetch(`https://employe-server-spby.onrender.com/employees/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setEmployees(employees.filter(employee => employee.id !== id));
      })
      .catch(error => console.error('Error deleting employee:', error));
  };

  const handleCancel = () => {
    setUsername('');
    setEmail('');
    setEmployeeId('');
    setStatus('Active'); // Reset status on cancel
    setShow(false);
    setIsAdding(true);
  };

  return (
   
    <div >
      <nav
        className="bg-primary mt-5  "
        style={{
          width: '100%',
          height: '100px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Employee Management App</h2>
      </nav>
      <div className="center-container">

        {alertVisible && (
          <div className="alert alert-success" role="alert" style={{ marginBottom: '20px' }}>
            {alertMessage}
          </div>
        )}

        <h1>{isAdding ? 'Add Employee' : 'Edit Employee'}</h1>

        <div className="centered-form-container mt-3">
          {isAdding && (
            <TextField
              className="mt-3"
              name="employeeId"
              label="Employee ID"
              variant="outlined"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              fullWidth
            />
          )}
          <TextField
            className="mt-3"
            name="username"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            className="mt-3"
            name="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          
          {/* Status Dropdown */}
          <FormControl fullWidth className="mt-3">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
              fullWidth
              MenuProps={{
                PaperProps: {
                  style: {
                    width: '100%', // Match the width of the other text fields
                  },
                },
              }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <div className="buttons mt-3">
            <Button
              className="btn-success"
              onClick={isAdding ? handleAddEmployee : handleEditEmployee}
            >
              {isAdding ? 'Add ' : 'Save Changes'}
            </Button>
            <Button className="btn-danger" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h1>Employee List</h1>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.username}</td>
                  <td>{employee.email}</td>
                  <td>{employee.status}</td> {/* Display status */}
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Button
                        variant="primary"
                        onClick={() => handleShow(employee)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{isAdding ? 'Add Employee' : 'Edit Employee'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TextField
              name="username"
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />

            {/* Status Dropdown in Modal */}
            <FormControl fullWidth className="mt-3">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
                fullWidth
                MenuProps={{
                  PaperProps: {
                    style: {
                      width: '100%', // Match the width of the other text fields
                    },
                  },
                }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button
              variant="primary"
              onClick={isAdding ? handleAddEmployee : handleEditEmployee}
            >
              {isAdding ? 'Add Employee' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>

  );
};

export default Note;
