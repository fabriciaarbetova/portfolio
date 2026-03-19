import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from './context/LangContext';
import Nav from './components/Nav';
import HeroCanvas from './components/HeroCanvas';
import RotatingText from './components/RotatingText';
import ProjectModal from './components/ProjectModal';
import projectsData from './projects.json';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function Loader({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1400);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="loader"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loader-name">Fabricia Arbetova</div>
      <div className="loader-bar">
        <div className="loader-progress" />
      </div>
    </motion.div>
  );
}

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function ProjectCard({ project, onClick, lang, t, index }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const thumb = project.type === 'video' ? project.src : project.images?.[0];

  return (
    <motion.div
      ref={ref}
      className="project-card"
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={index * 0.05}
      onClick={() => onClick(project)}
    >
      {project.type === 'video' ? (
        <video
          className="project-card-media"
          src={thumb}
          muted
          loop
          playsInline
          autoPlay
        />
      ) : (
        <img className="project-card-media" src={thumb} alt={project.title[lang]} />
      )}
      <div className="project-card-overlay">
        <div className="project-card-info">
          <div className="project-card-category">{t.projects[project.category] || project.category}</div>
          <div className="project-card-title">{project.title[lang]}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const { t, lang } = useLang();
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const projects = [
    ...projectsData.simulations,
    ...projectsData.archviz,
    ...projectsData.film,
    ...projectsData.motion,
  ];

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);


  return (
    <>
      <AnimatePresence>
        {!loaded && <Loader key="loader" onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <>
          <Nav />

          {/* HERO */}
          <section className="hero">
            <HeroCanvas />
            <div className="hero-content">
              <motion.h1
                className="hero-name"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                Fabricia<br />Arbetova
              </motion.h1>
              <motion.p
                className="hero-role"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                {t.hero.role}
              </motion.p>
              <motion.div
                className="hero-scroll"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                {t.hero.scroll}
              </motion.div>
            </div>
            <RotatingText text="FABRICIA ARBETOVA · 3D ARTIST · " />
          </section>

          {/* SHOWREEL */}
          <section className="showreel-section">
            <div className="section-label">{t.showreel}</div>
            <video
              className="showreel-video"
              src="/portfolio/assets/videos/showreel.mp4"
              controls
              muted
              loop
              playsInline
            />
          </section>

          {/* PROJECTS */}
          <section className="projects-section" id="projects">
            <div className="projects-header">
              <h2 className="section-title">{t.projects.title}</h2>
              <div className="category-filters">
                {['all', 'simulation', 'archviz', 'film', 'motion'].map(cat => (
                  <button
                    key={cat}
                    className={`filter-btn ${filter === cat ? 'active' : ''}`}
                    onClick={() => setFilter(cat)}
                  >
                    {t.projects[cat]}
                  </button>
                ))}
              </div>
            </div>
            <div className="projects-grid">
              {filtered.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onClick={setSelected}
                  lang={lang}
                  t={t}
                  index={i}
                />
              ))}
            </div>
          </section>

          {/* CONTACT */}
          <section className="about-section" id="about">
            <motion.div
              className="about-contact"
              id="contact"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="about-label">{t.contact.label}</div>
              <a href="mailto:fabricia.arbetova@gmail.com" className="contact-link">
                fabricia.arbetova@gmail.com
              </a>
              <a href="tel:+420732845872" className="contact-link">
                +420 732 845 872
              </a>
              <a href="https://www.linkedin.com/in/fabricia-arbetov%C3%A1-0874382b5/" className="contact-link" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href="https://www.instagram.com/fabricia_arbetova/" className="contact-link" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </motion.div>
          </section>

          {/* FOOTER */}
          <footer>
            <span className="footer-copy">{t.footer}</span>
            <span className="footer-copy" style={{ opacity: 0.4 }}>3D · Simulation · Arch Viz</span>
          </footer>

          {/* MODAL */}
          <AnimatePresence>
            {selected && (
              <ProjectModal
                key={selected.id}
                project={selected}
                onClose={() => setSelected(null)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
