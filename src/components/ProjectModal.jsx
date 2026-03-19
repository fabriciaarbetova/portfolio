import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LangContext';
import GallerySlider from './GallerySlider';

export default function ProjectModal({ project, onClose, onPrevProject, onNextProject }) {
    const { t, lang } = useLang();
    // For gallery: globalIndex spans renders then wireframes
    const [galleryIndex, setGalleryIndex] = useState(0);
    // For video-with-original: 0 = render, 1 = original
    const [videoTab, setVideoTab] = useState(0);

    // Reset position when project changes
    useEffect(() => {
        setGalleryIndex(0);
        setVideoTab(0);
    }, [project?.id]);

    // Centralised keyboard handler
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') { onClose(); return; }

            if (project.type === 'gallery') {
                const renders = project.images || [];
                const wires = project.wireframes || [];
                const total = renders.length + wires.length;
                if (e.key === 'ArrowRight') {
                    if (galleryIndex < total - 1) setGalleryIndex(i => i + 1);
                    else onNextProject();
                }
                if (e.key === 'ArrowLeft') {
                    if (galleryIndex > 0) setGalleryIndex(i => i - 1);
                    else onPrevProject();
                }
            }

            if (project.type === 'video') {
                const slots = project.original ? 2 : 1;
                if (e.key === 'ArrowRight') {
                    if (videoTab < slots - 1) setVideoTab(i => i + 1);
                    else onNextProject();
                }
                if (e.key === 'ArrowLeft') {
                    if (videoTab > 0) setVideoTab(i => i - 1);
                    else onPrevProject();
                }
            }
        };
        window.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose, onPrevProject, onNextProject, project, galleryIndex, videoTab]);

    if (!project) return null;

    const handleGalleryNavigate = (delta) => {
        if (delta === 'prev-project') { onPrevProject(); return; }
        if (delta === 'next-project') { onNextProject(); return; }
        const renders = project.images || [];
        const wires = project.wireframes || [];
        const total = renders.length + wires.length;
        const next = galleryIndex + delta;
        if (next >= 0 && next < total) setGalleryIndex(next);
    };

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
                        <>
                            {project.original && (
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                    <button
                                        className={`filter-btn ${videoTab === 0 ? 'active' : ''}`}
                                        onClick={() => setVideoTab(0)}
                                    >
                                        {t.render}
                                    </button>
                                    <button
                                        className={`filter-btn ${videoTab === 1 ? 'active' : ''}`}
                                        onClick={() => setVideoTab(1)}
                                    >
                                        {t.original}
                                    </button>
                                </div>
                            )}
                            <video
                                key={`${project.id}-${videoTab}`}
                                className="modal-video"
                                src={videoTab === 1 && project.original ? project.original : project.src}
                                controls
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        </>
                    )}

                    {project.type === 'gallery' && (
                        <GallerySlider
                            projectId={project.id}
                            images={project.images}
                            wireframes={project.wireframes}
                            globalIndex={galleryIndex}
                            onNavigate={handleGalleryNavigate}
                        />
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
