import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LangContext';

// GallerySlider is now "controlled" — parent manages position via globalIndex
// globalIndex spans renders first, then wireframes:
//   0..renders.length-1 → renders
//   renders.length..renders.length+wireframes.length-1 → wireframes
// onNavigate(delta) is called when navigation goes past the boundaries

export default function GallerySlider({ projectId, images, wireframes, globalIndex, onNavigate }) {
    const { t } = useLang();
    const renders = images || [];
    const wires = wireframes || [];
    const total = renders.length + wires.length;

    const tab = globalIndex < renders.length ? 'renders' : 'wireframes';
    const localIndex = tab === 'renders' ? globalIndex : globalIndex - renders.length;
    const current = tab === 'renders' ? renders : wires;

    useEffect(() => {
        const preloadNext = () => {
            if (globalIndex < total - 1) {
                const nextSrc = globalIndex + 1 < renders.length 
                    ? renders[globalIndex + 1] 
                    : wires[globalIndex + 1 - renders.length];
                new Image().src = nextSrc;
            }
            if (globalIndex > 0) {
                const prevSrc = globalIndex - 1 < renders.length 
                    ? renders[globalIndex - 1] 
                    : wires[globalIndex - 1 - renders.length];
                new Image().src = prevSrc;
            }
        };
        preloadNext();
    }, [globalIndex, renders, wires, total]);

    const handlePrev = () => {
        if (globalIndex > 0) onNavigate(-1);
        else onNavigate('prev-project');
    };

    const handleNext = () => {
        if (globalIndex < total - 1) onNavigate(1);
        else onNavigate('next-project');
    };

    return (
        <div>
            {wires.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button
                        className={`filter-btn ${tab === 'renders' ? 'active' : ''}`}
                        onClick={() => onNavigate(-(globalIndex))}
                    >
                        {t.renders}
                    </button>
                    <button
                        className={`filter-btn ${tab === 'wireframes' ? 'active' : ''}`}
                        onClick={() => onNavigate(renders.length - globalIndex)}
                    >
                        {t.wireframes}
                    </button>
                </div>
            )}
            <div className="gallery-slider">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${projectId}-${tab}-${localIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="gallery-slide"
                    >
                        <img src={current[localIndex]} alt="" />
                    </motion.div>
                </AnimatePresence>
            </div>
            {total > 1 && (
                <div className="gallery-nav">
                    <button className="gallery-btn" onClick={handlePrev}>&#8592;</button>
                    <button className="gallery-btn" onClick={handleNext}>&#8594;</button>
                    <span className="gallery-counter">{localIndex + 1} / {current.length}</span>
                </div>
            )}
        </div>
    );
}
