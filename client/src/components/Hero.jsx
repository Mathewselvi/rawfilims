import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtils';
import './Hero.css';

const Hero = () => {
    const [heroContent, setHeroContent] = useState(null);

    useEffect(() => {
        const fetchHeroContent = async () => {
            try {
                const res = await axios.get(`${API_URL}/sections`);
                const heroSection = res.data.find(s => s.section === 'hero');
                if (heroSection) {
                    // Assuming heroSection directly contains type and imageUrl
                    setHeroContent(heroSection);
                }
            } catch (err) {
                console.error("Error fetching hero content:", err);
            }
        };
        fetchHeroContent();
    }, []);

    // Default static image if no dynamic content found
    const defaultBgImage = "https://images.unsplash.com/photo-1519307212971-dd9561667ffb?q=80&w=1287&auto=format&fit=crop";
    const bgImage = heroContent && heroContent.imageUrl
        ? getImageUrl(heroContent.imageUrl)
        : defaultBgImage;

    return (
        <section
            className="hero parallax-section"
            style={{
                backgroundImage: heroContent && heroContent.type === 'video' ? 'none' : `url(${bgImage})`,
                height: '100vh',
                backgroundPosition: 'center center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {heroContent && heroContent.type === 'video' && (
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'translate(-50%, -50%)',
                        zIndex: -1
                    }}
                >
                    <source src={getImageUrl(heroContent.imageUrl)} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
            <div className="parallax-overlay"></div>
            <div className="hero-content container fade-in parallax-content">
                <h1>Capturing <span className="highlight">Moments</span> <br /> Creating <span className="highlight">Memories</span></h1>
                <p>Premium Wedding Photography & Videography</p>
                <div className="hero-buttons">
                    <Link to="/works" className="btn btn-primary">View Our Work</Link>
                    <a href="#contact" className="btn btn-outline">Contact Us</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
