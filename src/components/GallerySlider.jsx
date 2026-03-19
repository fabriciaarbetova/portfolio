import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LangContext';

export default function GallerySlider({ images, wireframes }) {
    const { t } = useLang();
    const [tab, setTab] = useState('renders');
    const [index, setIndex] = useState(0);

    const current = tab === 'renders' ? images : (wireframes || []);
    const total = current.length;

    const prev = () => setIndex(i => (i - 1 + total) % total);
    const next = () => setIndex(i => (i + 1) % total);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [total, index]);

    return (
        <div>
            {wireframes && wireframes.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button
                        className={`filter-btn ${tab === 'renders' ? 'active' : ''}`}
                        onClick={() => { setTab('renders'); setIndex(0); }}
                    >
                        {t.renders}
                    </button>
                    <button
                        className={`filter-btn ${tab === 'wireframes' ? 'active' : ''}`}
                        onClick={() => { setTab('wireframes'); setIndex(0); }}
                    >
                        {t.wireframes}
                    </button>
                </div>
            )}
            <div className="gallery-slider">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${tab}-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="gallery-slide"
                    >
                        <img src={current[index]} alt="" />
                    </motion.div>
                </AnimatePresence>
            </div>
            {total > 1 && (
                <div className="gallery-nav">
                    <button className="gallery-btn" onClick={prev}>&#8592;</button>
                    <button className="gallery-btn" onClick={next}>&#8594;</button>
                    <span className="gallery-counter">{index + 1} / {total}</span>
                </div>
            )}
        </div>
    );
}
