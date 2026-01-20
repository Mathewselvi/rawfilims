import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { API_URL } from '../config';
import './Works.css';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Works = () => {
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [shuffledWorks, setShuffledWorks] = useState([]);
    const [selectedWork, setSelectedWork] = useState(null);

    useEffect(() => {
        fetchWorks();
    }, []);

    const fetchWorks = async () => {
        try {
            const res = await axios.get(`${API_URL}/works`);
            setWorks(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching works:', err);
            setLoading(false);
        }
    };

    // Shuffle function
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Filter and shuffle effect
    useEffect(() => {
        if (works.length > 0) {
            let filtered = filter === 'All' ? works : works.filter(work => work.category === filter);
            setShuffledWorks(shuffleArray(filtered));
        }
    }, [works, filter]);

    const [categories, setCategories] = useState(['All']);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/categories`);
                setCategories(['All', ...res.data.map(c => c.name)]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    const openLightbox = (work) => {
        setSelectedWork(work);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeLightbox = () => {
        setSelectedWork(null);
        document.body.style.overflow = 'unset'; // Restore scrolling
    };


    const handleNext = (e) => {
        if (e) e.stopPropagation();
        if (!selectedWork) return;
        const currentIndex = shuffledWorks.findIndex(w => w._id === selectedWork._id);
        const nextIndex = (currentIndex + 1) % shuffledWorks.length;
        setSelectedWork(shuffledWorks[nextIndex]);
    };

    const handlePrev = (e) => {
        if (e) e.stopPropagation();
        if (!selectedWork) return;
        const currentIndex = shuffledWorks.findIndex(w => w._id === selectedWork._id);
        const prevIndex = (currentIndex - 1 + shuffledWorks.length) % shuffledWorks.length;
        setSelectedWork(shuffledWorks[prevIndex]);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedWork) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') closeLightbox();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedWork, shuffledWorks]); // Dependencies are important here

    return (
        <>
            <Navbar />
            <div style={{ padding: '8rem 2rem 4rem', minHeight: '100vh', backgroundColor: 'var(--color-black)' }}>
                <div className="container">
                    <h2 className="section-title">Our <span>Masterpieces</span></h2>

                    {/* Filters */}
                    <div className="filter-container">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'white' }}>Loading works...</p>
                    ) : (
                        <div className="works-masonry">
                            {shuffledWorks.map(work => (
                                <div key={work._id} className="work-item" onClick={() => openLightbox(work)}>
                                    <div className="work-content">
                                        {work.type === 'video' ? (
                                            <div className="video-thumbnail">
                                                <video
                                                    src={`http://localhost:5001${work.imageUrl}`}
                                                    muted
                                                    loop
                                                    onMouseOver={e => e.target.play()}
                                                    onMouseOut={e => e.target.pause()}
                                                />
                                                <div className="play-icon">▶</div>
                                            </div>
                                        ) : (
                                            <img
                                                src={`http://localhost:5001${work.imageUrl}`}
                                                alt={work.title}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found' }}
                                            />
                                        )}
                                        <div className="work-overlay">
                                            <h3>{work.title}</h3>
                                            <span>{work.category}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {!loading && shuffledWorks.length === 0 && (
                                <p style={{ width: '100%', textAlign: 'center', color: 'gray' }}>No works found for this category.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedWork && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeLightbox}>
                            <X size={32} />
                        </button>

                        <button className="nav-btn prev-btn" onClick={handlePrev}>
                            <ChevronLeft size={40} />
                        </button>

                        {selectedWork.type === 'video' ? (
                            <video
                                src={`http://localhost:5001${selectedWork.imageUrl}`}
                                controls
                                autoPlay
                                className="lightbox-media"
                            />
                        ) : (
                            <img
                                src={`http://localhost:5001${selectedWork.imageUrl}`}
                                alt={selectedWork.title}
                                className="lightbox-media"
                            />
                        )}

                        <button className="nav-btn next-btn" onClick={handleNext}>
                            <ChevronRight size={40} />
                        </button>

                        <div className="lightbox-info">
                            <h3>{selectedWork.title}</h3>
                            <p>{selectedWork.category}</p>
                            {selectedWork.description && <p className="desc">{selectedWork.description}</p>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Works;

