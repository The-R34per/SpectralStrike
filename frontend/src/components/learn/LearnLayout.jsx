import { useState } from "react";
import WhatIsPage from "./WhatIsPage";
import WhyBuiltPage from "./WhyBuiltPage";
import HowItWorksPage from "./HowItWorksPage";
import AboutPage from "./AboutPage";


const TABS = [
  { id: "what",  label: "What is SpectralStrike", icon: "⬡" },
  { id: "why",   label: "Why it was built",        icon: "◈" },
  { id: "how",   label: "How it works",            icon: "◎" },
  { id: "about", label: "About the creator",       icon: "◇" },
];

const PAGES = {
  what:  <WhatIsPage />,
  why:   <WhyBuiltPage />,
  how:   <HowItWorksPage />,
  about: <AboutPage />,
};

export default function LearnLayout() {
  const [active, setActive] = useState("what");

  return (
    <div className="learn-root">
      <div className="scanlines" aria-hidden="true" />

      <nav className="learn-nav" role="tablist" aria-label="Learn sections">
        <div className="learn-nav-eyebrow">
          <span className="aqua mono">// learn</span>
        </div>
        <div className="learn-nav-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active === tab.id}
              className={`learn-tab ${active === tab.id ? "learn-tab--active" : ""}`}
              onClick={() => setActive(tab.id)}
            >
              <span className="learn-tab-icon" aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="learn-content" role="tabpanel" key={active}>
        {PAGES[active]}
      </main>
    </div>
  );
}
