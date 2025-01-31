import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationFailure, setRegistrationFailure] = useState(false);
  const [errorData, setErrorData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const url = 'https://doctors-appointment-3nvy.onrender.com/api/v1/users';
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: formData }),
      });

      if (response.ok) {
        setRegistrationSuccess(true);
      } else {
        const data = await response.json();
        setErrorData(data.errors);
        setRegistrationFailure(true);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div className="regis_page">
      <h2>Register</h2>
      {registrationSuccess ? (
        <div className="reg_success">
          <p>Registration successful! You can now log in.</p>
          <Link to="/login" className="splash_link">Login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">
            Name:
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          {registrationFailure && errorData && errorData.name && (
            <p className="reg_error">
              Name
              {' '}
              {errorData.name[0]}
            </p>
          )}
          <br />
          <label htmlFor="email">
            Email:
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          {registrationFailure && errorData && errorData.email && (
            <p className="reg_error">
              Email
              {' '}
              {errorData.email[0]}
            </p>
          )}
          <br />
          <label htmlFor="password">
            Password:
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          {registrationFailure && errorData && errorData.password && (
            <p className="reg_error">
              Password
              {' '}
              {errorData.password[0]}
            </p>
          )}
          <br />
          <label htmlFor="confirm_password">
            Confirm Password:
            <input
              id="confirm_password"
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
          </label>
          {registrationFailure && errorData && errorData.password_confirmation && (
            <p className="reg_error">
              Password
              {' '}
              {errorData.password_confirmation[0]}
            </p>
          )}
          <br />
          <div className="reg_btns">
            <button type="submit" className="splash_link login_btn">Register</button>
            <Link to="/login" className="splash_link">Login</Link>
          </div>
        </form>
      )}

    </div>
  );
};

export default RegistrationForm;
