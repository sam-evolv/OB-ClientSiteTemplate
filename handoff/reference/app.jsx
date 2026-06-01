// ============================================================================
// App — composes the site, threads tweaks through every section.
// ============================================================================

const {
  business, SECTIONS,
  useScrolledPast,
  StickyNav, StickyBookBar, ScrollProgress,
  Hero, StatsBar, Mission, Events, About, Gallery, WhereWeGo, Press, Contact, Footer,
  Tweaks,
} = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#F5F5F4",
  "heroVariant": "photo",
  "fontScale": 1,
  "showStats": true,
  "showMission": true,
  "showEvents": true,
  "showAbout": true,
  "showGallery": true,
  "showTravel": true,
  "showPress": true,
  "showContact": true,
  "filmGrain": true
}/*EDITMODE-END*/;

function App() {
  // Tweak state owned here. The Tweaks panel posts changes via setTweak,
  // we mirror them in local state so every section re-renders.
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);

  // Apply font scale to the document root so it propagates through clamp() etc.
  React.useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(tweaks.fontScale));
  }, [tweaks.fontScale]);

  const scrolled = useScrolledPast(500);
  const accent = tweaks.accent;
  const b = business;

  // Filter nav to only show sections that are currently visible.
  const activeSections = SECTIONS.filter((s) => {
    if (s.id === 'mission')  return tweaks.showMission;
    if (s.id === 'events')   return tweaks.showEvents;
    if (s.id === 'coaching') return tweaks.showEvents;
    if (s.id === 'about')    return tweaks.showAbout;
    if (s.id === 'gallery')  return tweaks.showGallery;
    if (s.id === 'press')    return tweaks.showPress;
    if (s.id === 'contact')  return tweaks.showContact;
    return true;
  });

  return (
    <div
      className={tweaks.filmGrain ? 'film-grain' : ''}
      data-screen-label="SIMply Golf 365"
      style={{
        background: '#080808', color: '#fafafa',
        fontFamily: 'Fraunces, Georgia, serif',
        minHeight: '100vh', overflowX: 'hidden',
        fontVariantNumeric: 'lining-nums',
      }}
    >
      <ScrollProgress accent={accent} />
      <StickyNav
        visible={scrolled}
        business={b}
        sections={activeSections}
        accent={accent}
      />
      <StickyBookBar visible={scrolled} accent={accent} />

      <Hero b={b} accent={accent} variant={tweaks.heroVariant} />

      {tweaks.showStats   && <StatsBar  b={b} accent={accent} />}
      {tweaks.showMission && <Mission   b={b} accent={accent} />}
      {tweaks.showEvents  && <Events    b={b} accent={accent} />}
      {tweaks.showAbout   && <About     b={b} accent={accent} />}
      {tweaks.showGallery && <Gallery   b={b} accent={accent} />}
      {tweaks.showTravel  && <WhereWeGo b={b} accent={accent} />}
      {tweaks.showPress   && <Press     b={b} accent={accent} />}
      {tweaks.showContact && <Contact   b={b} accent={accent} />}

      <Footer b={b} accent={accent} />

      <Tweaks defaults={TWEAK_DEFAULTS} onChange={setTweaks} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
