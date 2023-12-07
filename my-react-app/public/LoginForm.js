import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <p className="welcome-message">
        Welcome! We're thrilled to have you as a member of our community in Monte Briza.
        Login to access your account and explore the latest updates and services just for you.
      </p>
      <Form id="loginForm" action="/login" method="post">
        <Form.Group controlId="username">
          <Form.Label className="label">Username:</Form.Label>
          <Form.Control className="input-field" type="text" name="username" required />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label className="label">Password:</Form.Label>
          <Form.Control className="input-field" type={showPassword ? 'text' : 'password'} name="password" required />
        </Form.Group>

        <Form.Group controlId="showPassword" className="checkbox-label">
          <Form.Check
            className="checkbox"
            type="checkbox"
            label="Show Password"
            onChange={togglePassword}
          />
        </Form.Group>

        <Button className="login-btn" variant="primary" type="submit">
          Login
        </Button>
      </Form>

      <div id="messageContainer"></div>
    </div>
  );
};

export default LoginForm;
