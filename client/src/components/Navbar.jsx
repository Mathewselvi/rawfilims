import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Camera } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(true);
    const prevScrollY = useRef(0);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine visibility
            if (currentScrollY > prevScrollY.current && currentScrollY > 80) {
                setVisible(false); // Scrolling down
            } else {
                setVisible(true); // Scrolling up
            }

            setScrolled(currentScrollY > 50);
            prevScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${!visible ? 'hidden' : ''}`}>
            <div className="container nav-container">
                <Link to="/" className="logo">
                    <Camera size={32} color="var(--color-primary-red)" />
                    <span>Rawfilims<span className="dot">.</span>uk</span>
                </Link>

                {/* Desktop Menu */}
                <ul className="nav-links desktop-only">
                    <li><Link to="/">Home</Link></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><Link to="/works">Works</Link></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>

                {/* Mobile Toggle */}
                <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><a href="/#about">About</a></li>
                        <li><a href="/#services">Services</a></li>
                        <li><Link to="/works">Works</Link></li>
                        <li><a href="/#contact">Contact</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
