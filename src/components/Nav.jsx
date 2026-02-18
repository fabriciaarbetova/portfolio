import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';

export default function Nav() {
    const { t, lang, toggle } = useLang();

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
        >
            <a href="#" className="nav-logo">Fabricia Arbetova</a>
            <div className="nav-right">
                <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => scrollTo('projects')}>
                    {t.nav.work}
                </button>
                <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => scrollTo('about')}>
                    {t.nav.about}
                </button>
                <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => scrollTo('contact')}>
                    {t.nav.contact}
                </button>
                <button className="lang-toggle" onClick={toggle}>
                    {lang === 'cz' ? 'EN' : 'CZ'}
                </button>
            </div>
        </motion.nav>
    );
}
