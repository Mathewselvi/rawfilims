import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Contact from '../components/Contact';

const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <About />
            <Services />
            <Contact />
            <footer style={{ backgroundColor: 'black', padding: '2rem', textAlign: 'center', borderTop: '1px solid #333' }}>
                <p style={{ color: '#666' }}>© {new Date().getFullYear()} Rawfilims.uk. All rights reserved.</p>
            </footer>
        </>
    );
};

export default Home;
