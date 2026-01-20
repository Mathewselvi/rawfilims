import { useEffect } from 'react';

const useScrollReveal = () => {
    useEffect(() => {
        const reveals = document.querySelectorAll('.reveal');

        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            const elementVisible = 150;

            reveals.forEach((reveal) => {
                const elementTop = reveal.getBoundingClientRect().top;

                if (elementTop < windowHeight - elementVisible) {
                    reveal.classList.add('active');
                } else {
                    reveal.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Trigger once on load

        return () => window.removeEventListener('scroll', revealOnScroll);
    }, []);
};

export default useScrollReveal;
