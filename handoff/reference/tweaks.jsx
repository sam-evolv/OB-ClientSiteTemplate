// ============================================================================
// Tweaks panel — accent colour, hero variant, section visibility, font scale.
//
// Controls live in a floating panel (bottom-right). They:
//   - Persist via __edit_mode_set_keys (the EDITMODE-BEGIN/END block in the HTML)
//   - Apply live to the page state
//
// The panel itself is only rendered when the host toggles "Tweaks" on.
// ============================================================================

const { TweaksPanel, useTweaks, TweakSection, TweakSlider, TweakToggle, TweakRadio, TweakColor } = window;

function Tweaks({ defaults, onChange }) {
  const [t, setTweak] = useTweaks(defaults);

  // Push every change up to the Site so it re-renders.
  React.useEffect(() => { onChange(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Brand">
        <TweakColor
          label="Accent"
          value={t.accent}
          options={[
            '#F5F5F4', // Pearl — founder's choice
            '#D4AF37', // Brand gold (OpenBook)
            '#22C55E', // Course green
            '#0EA5E9', // Sky
            '#EF4444', // Ember red
            '#A78BFA', // Lavender
          ]}
          onChange={(v) => setTweak('accent', v)}
        />
      </TweakSection>

      <TweakSection label="Hero">
        <TweakRadio
          label="Variant"
          value={t.heroVariant}
          options={[
            { value: 'photo', label: 'Photo' },
            { value: 'split', label: 'Split' },
            { value: 'type',  label: 'Type-led' },
          ]}
          onChange={(v) => setTweak('heroVariant', v)}
        />
      </TweakSection>

      <TweakSection label="Type">
        <TweakSlider
          label="Font scale"
          value={t.fontScale}
          min={0.85} max={1.15} step={0.01}
          unit="x"
          onChange={(v) => setTweak('fontScale', v)}
        />
      </TweakSection>

      <TweakSection label="Sections">
        <TweakToggle label="Stats bar"   value={t.showStats}   onChange={(v) => setTweak('showStats', v)} />
        <TweakToggle label="Mission"     value={t.showMission} onChange={(v) => setTweak('showMission', v)} />
        <TweakToggle label="Events"      value={t.showEvents}  onChange={(v) => setTweak('showEvents', v)} />
        <TweakToggle label="About"       value={t.showAbout}   onChange={(v) => setTweak('showAbout', v)} />
        <TweakToggle label="Gallery"     value={t.showGallery} onChange={(v) => setTweak('showGallery', v)} />
        <TweakToggle label="Where we go" value={t.showTravel}  onChange={(v) => setTweak('showTravel', v)} />
        <TweakToggle label="Press"       value={t.showPress}   onChange={(v) => setTweak('showPress', v)} />
        <TweakToggle label="Contact"     value={t.showContact} onChange={(v) => setTweak('showContact', v)} />
      </TweakSection>

      <TweakSection label="Effects">
        <TweakToggle
          label="Film grain"
          value={t.filmGrain}
          onChange={(v) => setTweak('filmGrain', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

Object.assign(window, { Tweaks });
