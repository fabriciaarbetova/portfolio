import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LangContext';
import GallerySlider from './GallerySlider';

export default function ProjectModal({ project, onClose }) {
    const { t, lang } = useLang();

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!project) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                <motion.div
                    className="modal-content"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <button className="modal-close" onClick={onClose}>&#215;</button>

                    {project.type === 'video' && (
                        <video
                            className="modal-video"
                            src={project.src}
                            controls
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    )}

                    {project.type === 'gallery' && (
                        <GallerySlider images={project.images} wireframes={project.wireframes} />
                    )}

                    <div className="modal-meta">
                        <div>
                            <div className="project-card-category">{t.projects[project.category] || project.category}</div>
                            <h2 className="modal-title">{project.title[lang]}</h2>
                            <p className="modal-desc">{project.desc[lang]}</p>
                        </div>
                        <div className="modal-year">{project.year}</div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
