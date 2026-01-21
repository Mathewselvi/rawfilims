import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, API_BASE_URL } from '../config';
import { Trash2, Plus, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('works'); // works, images, categories
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Check auth
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) navigate('/login');
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <div className="admin-container">
            {/* Mobile Toggle */}
            <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <h2 className="admin-title">
                    Admin <span style={{ color: 'var(--color-primary-red)' }}>Panel</span>
                </h2>

                <nav className="admin-nav">
                    <button
                        onClick={() => { setActiveTab('works'); setIsSidebarOpen(false); }}
                        className={`sidebar-btn ${activeTab === 'works' ? 'active' : ''}`}
                    >
                        Portfolio Works
                    </button>
                    <button
                        onClick={() => { setActiveTab('images'); setIsSidebarOpen(false); }}
                        className={`sidebar-btn ${activeTab === 'images' ? 'active' : ''}`}
                    >
                        Site Images
                    </button>
                    <button
                        onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }}
                        className={`sidebar-btn ${activeTab === 'categories' ? 'active' : ''}`}
                    >
                        Categories
                    </button>
                </nav>

                <button onClick={handleLogout} className="sidebar-btn logout-btn">
                    <LogOut size={18} style={{ marginRight: '10px' }} /> Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="admin-content">
                {activeTab === 'works' && <WorksManager />}
                {activeTab === 'images' && <SiteImagesManager />}
                {activeTab === 'categories' && <CategoryManager />}
            </div>
        </div>
    );
};

// --- Sub Components ---

const WorksManager = () => {
    const [works, setWorks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchWorks();
        fetchCategories();
    }, []);

    const fetchWorks = async () => {
        const res = await axios.get(`${API_URL}/works`);
        setWorks(res.data);
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_URL}/categories`);
            setCategories(res.data);
            if (res.data.length > 0 && !category) {
                setCategory(res.data[0].name);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this work?')) {
            await axios.delete(`${API_URL}/works/${id}`);
            fetchWorks();
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (files.length === 0) return alert('Please select at least one file');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        setUploading(true);
        try {
            await axios.post(`${API_URL}/works`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploading(false);
            setShowForm(false);
            setTitle('');
            setFiles([]);
            fetchWorks();
        } catch (err) {
            console.error(err);
            setUploading(false);
            alert('Upload failed');
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="manager-header">
                <h2 className="manager-title">Manage <span style={{ color: 'var(--color-primary-red)' }}>Works</span></h2>
                <button className="btn" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} style={{ marginRight: '5px' }} /> Add Work
                </button>
            </div>

            {showForm && (
                <div className="form-container">
                    <h3 style={{ marginBottom: '1.5rem', color: 'white', fontSize: '1.4rem' }}>Upload New Work</h3>
                    <form onSubmit={handleUpload} className="form-group">
                        <div className="form-row">
                            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="admin-input" required />
                            <select value={category} onChange={e => setCategory(e.target.value)} className="admin-input">
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <input type="file" accept="image/*,video/*" multiple onChange={e => setFiles(e.target.files)} className="admin-input" style={{ padding: '0.6rem' }} required />
                        <button className="btn" disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Upload Work'}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid-cards">
                {works.map(work => (
                    <div key={work._id} className="card">
                        {work.type === 'video' ? (
                            <video src={work.imageUrl.startsWith('http') ? work.imageUrl : `${API_BASE_URL}${work.imageUrl}`} className="card-media" />
                        ) : (
                            <img src={work.imageUrl.startsWith('http') ? work.imageUrl : `${API_BASE_URL}${work.imageUrl}`} alt={work.title} className="card-media" />
                        )}
                        <div style={{ padding: '1.2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <h4 style={{ fontSize: '1.1rem', color: 'white', margin: 0 }}>{work.title}</h4>
                                <button onClick={() => handleDelete(work._id)} style={{ background: 'none', border: 'none', color: 'var(--color-primary-red)', cursor: 'pointer', opacity: 0.8 }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <span style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{work.category}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const res = await axios.get(`${API_URL}/categories`);
        setCategories(res.data);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/categories`, { name: newCategory });
            setNewCategory('');
            fetchCategories();
        } catch (err) {
            alert('Error adding category');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete category?')) {
            await axios.delete(`${API_URL}/categories/${id}`);
            fetchCategories();
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="manager-header">
                <h2 className="manager-title">Manage <span style={{ color: 'var(--color-primary-red)' }}>Categories</span></h2>
            </div>

            <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                <input
                    type="text"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="New Category Name"
                    className="admin-input"
                    required
                />
                <button className="btn" style={{ whiteSpace: 'nowrap' }}>
                    <Plus size={18} style={{ marginRight: '5px' }} /> Add
                </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {categories.map(cat => (
                    <div key={cat._id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1.5rem',
                        backgroundColor: 'var(--color-dark-surface)',
                        borderRadius: '8px',
                        border: '1px solid #333'
                    }}>
                        <span style={{ color: 'white', fontSize: '1.1rem' }}>{cat.name}</span>
                        <button onClick={() => handleDelete(cat._id)} style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SiteImagesManager = () => {
    const [sections, setSections] = useState([]);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        const res = await axios.get(`${API_URL}/sections`);
        setSections(res.data);
    };

    // Helper to get image for section from state
    const getImage = (name) => {
        const s = sections.find(sec => sec.section === name);
        if (!s) return null;
        return s.imageUrl.startsWith('http') ? s.imageUrl : `${API_BASE_URL}${s.imageUrl}`;
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="manager-header">
                <h2 className="manager-title">Site <span style={{ color: 'var(--color-primary-red)' }}>Images</span></h2>
            </div>

            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <SectionImageCard title="Hero Section" sectionName="hero" currentImage={getImage('hero')} onUpdate={fetchSections} />
                <SectionImageCard title="About Section (Background)" sectionName="about" currentImage={getImage('about')} onUpdate={fetchSections} />
                <SectionImageCard title="About Section (Content Image)" sectionName="about-content" currentImage={getImage('about-content')} onUpdate={fetchSections} />
                <SectionImageCard title="Services Section" sectionName="services" currentImage={getImage('services')} onUpdate={fetchSections} />
                <SectionImageCard title="Contact Section" sectionName="contact" currentImage={getImage('contact')} onUpdate={fetchSections} />
            </div>
        </div>
    );
};

const SectionImageCard = ({ title, sectionName, currentImage, onUpdate }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('section', sectionName);
        formData.append('image', file);

        setUploading(true);
        try {
            await axios.post(`${API_URL}/sections`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploading(false);
            setFile(null);
            onUpdate();
            alert('Image updated!');
        } catch (err) {
            console.error(err);
            setUploading(false);
            alert('Failed to update image');
        }
    };

    return (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: 'white', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.8rem', fontSize: '1.1rem' }}>{title}</h3>

            <div style={{ height: '200px', backgroundColor: '#111', marginBottom: '1.2rem', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #333' }}>
                {currentImage ? (
                    <img src={currentImage} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <span style={{ color: '#555' }}>No Image Set</span>
                )}
            </div>

            <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '0.8rem', flexDirection: 'column' }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setFile(e.target.files[0])}
                    className="admin-input"
                    style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                />
                <button
                    className="btn"
                    disabled={!file || uploading}
                    style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem', marginTop: '0.5rem' }}
                >
                    {uploading ? 'Updating...' : 'Update Image'}
                </button>
            </form>
        </div>
    );
};

export default AdminDashboard;
