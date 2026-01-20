import React from 'react';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import axios from 'axios';
import { API_URL, API_BASE_URL } from '../config';
import { useState, useEffect } from 'react';
import './Contact.css';

const Contact = () => {
    useScrollReveal();
    const [bgImage, setBgImage] = useState("https://images.unsplash.com/photo-1481653125770-b78c206c59d4?q=80&w=2670&auto=format&fit=crop");

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await axios.get(`${API_URL}/sections`);
                const section = res.data.find(s => s.section === 'contact');
                if (section) setBgImage(`${API_BASE_URL}${section.imageUrl}`);
            } catch (err) {
                console.error(err);
            }
        };
        fetchImage();
    }, []);

    return (
        <section id="contact" className="parallax-section" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="parallax-overlay"></div>
            <div className="container parallax-content reveal">
                <h2 className="section-title">Get in <span>Touch</span></h2>
                <div className="contact-container">

                    <div className="contact-info-card">
                        <h3 className="contact-info-title">Contact Info</h3>
                        <div className="contact-details">
                            <div className="contact-item">
                                <Phone color="var(--color-primary-red)" />
                                <span className="contact-text">+44 123 456 7890</span>
                            </div>
                            <div className="contact-item">
                                <Mail color="var(--color-primary-red)" />
                                <span className="contact-text">info@rawfilims.uk</span>
                            </div>
                            <div className="contact-item">
                                <MapPin color="var(--color-primary-red)" />
                                <span className="contact-text">London, UK</span>
                            </div>
                            <div className="contact-item">
                                <Instagram color="var(--color-primary-red)" />
                                <span className="contact-text">@rawfilims.uk</span>
                            </div>
                        </div>
                    </div>

                    <form className="contact-form">
                        <input type="text" placeholder="Your Name" className="contact-input" />
                        <input type="email" placeholder="Your Email" className="contact-input" />
                        <input type="tel" placeholder="Phone Number" className="contact-input" />
                        <textarea placeholder="Tell us about your event..." rows="5" className="contact-input"></textarea>
                        <button className="btn" style={{ width: 'fit-content' }}>Send Message</button>
                    </form>

                </div>
            </div>
        </section>
    );
};

export default Contact;
