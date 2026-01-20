import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

import { API_URL } from '../config';
import { getImageUrl } from '../utils/imageUtils';
import axios from 'axios';
import { useState, useEffect } from 'react';

const About = () => {
    useScrollReveal();
    const [bgImage, setBgImage] = useState("https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2670&auto=format&fit=crop");
    const [contentImage, setContentImage] = useState("https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2940&auto=format&fit=crop");

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await axios.get(`${API_URL}/sections`);
                const section = res.data.find(s => s.section === 'about');
                if (section) setBgImage(getImageUrl(section.imageUrl));

                const content = res.data.find(s => s.section === 'about-content');
                if (content) setContentImage(getImageUrl(content.imageUrl));
            } catch (err) {
                console.error(err);
            }
        };
        fetchImage();
    }, []);

    return (
        <section id="about" className="parallax-section" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="parallax-overlay"></div>
            <div className="container parallax-content reveal">
                <h2 className="section-title">Who <span>We Are</span></h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-gray-100)', marginBottom: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            Rawfilims.uk is a premier wedding photography and videography studio dedicated to storytelling.
                            We don't just capture events; we bottle emotions, freezing the laughter, tears, and joy of your
                            special day into cinematic masterpieces.
                        </p>
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-gray-100)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            With a passionate team of creative professionals, we bring a cinematic edge to wedding documentation,
                            ensure every frame is a work of art.
                        </p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={contentImage}
                            alt="About Us"
                            style={{ borderRadius: '4px', boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3)', border: '2px solid rgba(255,255,255,0.1)' }}
                        />
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', border: '3px solid var(--color-primary-red)', zIndex: -1 }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
