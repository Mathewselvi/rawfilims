import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import Navbar from '../components/Navbar';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { username, password });
            if (res.data.success) {
                localStorage.setItem('adminToken', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/admin');
            }
        } catch (err) {
            console.error('Login Error:', err);
            const msg = err.response?.data?.message || err.message || 'Login failed';
            setError(msg);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-black)'
            }}>
                <div style={{
                    backgroundColor: 'var(--color-dark-surface-2)',
                    padding: '3rem',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>Admin Login</h2>
                    {error && <p style={{ color: 'var(--color-primary-red)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={inputStyle}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                        <button className="btn" style={{ width: '100%' }}>Login</button>
                    </form>
                </div>
            </div>
        </>
    );
};

const inputStyle = {
    width: '100%',
    padding: '1rem',
    backgroundColor: 'var(--color-dark-surface)',
    border: '1px solid #333',
    borderRadius: '4px',
    color: 'white',
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    outline: 'none'
};

export default Login;
