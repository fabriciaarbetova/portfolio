import React, { createContext, useContext, useState } from 'react';

const LangContext = createContext();

export const translations = {
    cz: {
        nav: {
            work: 'Práce',
            about: 'O mně',
            contact: 'Kontakt',
        },
        hero: {
            role: '3D Artist — Simulace — Architektonická vizualizace',
            scroll: 'Posunout',
        },
        showreel: 'Showreel 2025',
        projects: {
            title: 'Projekty',
            all: 'Vše',
            simulation: 'Simulace',
            archviz: 'Arch. Viz',
            film: 'Film',
        },
        about: {
            label: 'O mně',
            text: 'Jsem 3D umělkyně se zaměřením na simulace a architektonické vizualizace. Pracuji v Houdini, Blenderu a Cinema 4D. Moje práce propojuje techniku s estetikou.',
        },
        contact: {
            label: 'Kontakt',
        },
        footer: '© 2025 Fabricia Arbetova',
        wireframes: 'Wireframy',
        renders: 'Rendery',
        prev: 'Předchozí',
        next: 'Další',
        close: 'Zavřít',
    },
    en: {
        nav: {
            work: 'Work',
            about: 'About',
            contact: 'Contact',
        },
        hero: {
            role: '3D Artist — Simulation — Architectural Visualization',
            scroll: 'Scroll',
        },
        showreel: 'Showreel 2025',
        projects: {
            title: 'Projects',
            all: 'All',
            simulation: 'Simulation',
            archviz: 'Arch. Viz',
            film: 'Film',
        },
        about: {
            label: 'About',
            text: 'I am a 3D artist focused on simulations and architectural visualization. I work in Houdini, Blender, and Cinema 4D. My work bridges technical precision with visual aesthetics.',
        },
        contact: {
            label: 'Contact',
        },
        footer: '© 2025 Fabricia Arbetova',
        wireframes: 'Wireframes',
        renders: 'Renders',
        prev: 'Previous',
        next: 'Next',
        close: 'Close',
    },
};

export function LangProvider({ children }) {
    const [lang, setLang] = useState('cz');
    const toggle = () => setLang(l => (l === 'cz' ? 'en' : 'cz'));
    const t = translations[lang];
    return (
        <LangContext.Provider value={{ lang, toggle, t }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    return useContext(LangContext);
}
