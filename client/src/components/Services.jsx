import React from 'react';
import { Camera, Video, Film, Heart } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

const servicesSet = [
    {
        icon: <Camera size={40} />,
        title: 'Wedding Photography',
        desc: 'Candid and traditional photography that captures the essence of your big day.'
    },
    {
        icon: <Video size={40} />,
        title: 'Cinematography',
        desc: 'High-definition wedding films that tell your love story like a movie.'
    },
    {
        icon: <Film size={40} />,
        title: 'Pre-Wedding Shoots',
        desc: 'Creative outdoor shoots to celebrate your chemistry before the wedding.'
    },
    {
        icon: <Heart size={40} />,
        title: 'Event Coverage',
        desc: 'Covering receptions, haldi, mehendi, and all cultural ceremonies.'
    }
];

import axios from 'axios';
import { API_URL, API_BASE_URL } from '../config';
import { useState, useEffect } from 'react';

const Services = () => {
    useScrollReveal();
    const [bgImage, setBgImage] = useState("https://images.unsplash.com/photo-1591700331354-f7eea65d1ce8?q=80&w=2670&auto=format&fit=crop");

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await axios.get(`${API_URL}/sections`);
                const section = res.data.find(s => s.section === 'services');
                if (section) setBgImage(`${API_BASE_URL}${section.imageUrl}`);
            } catch (err) {
                console.error(err);
            }
        };
        fetchImage();
    }, []);

    return (
        <section id="services" className="parallax-section" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="parallax-overlay"></div>
            <div className="container parallax-content reveal">
                <h2 className="section-title">Our <span>Services</span></h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {servicesSet.map((service, index) => (
                        <div key={index} style={{
                            backgroundColor: 'rgba(18, 18, 18, 0.8)', /* Semi-transparent card */
                            backdropFilter: 'blur(5px)',
                            padding: '2.5rem',
                            borderRadius: '8px',
                            textAlign: 'center',
                            border: '1px solid rgba(255,255,255,0.1)',
                            transition: 'transform 0.3s ease, background-color 0.3s'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                                e.currentTarget.style.borderColor = 'var(--color-primary-red)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.backgroundColor = 'rgba(18, 18, 18, 0.8)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            }}
                        >
                            <div style={{ color: 'var(--color-primary-red)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                {service.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-sans)', color: 'white' }}>{service.title}</h3>
                            <p style={{ color: 'var(--color-gray-300)' }}>{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
