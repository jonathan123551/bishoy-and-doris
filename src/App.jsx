import { useState } from 'react';
import useLenis from './hooks/useLenis';
import EnvelopeIntro from './components/EnvelopeIntro';
import OpeningScene from './components/OpeningScene';
import NamesScene from './components/NamesScene';
import CeremonyScene from './components/CeremonyScene';
import ReceptionScene from './components/ReceptionScene';
import DateSequence from './components/DateSequence';
import PhotoStory from './components/PhotoStory';
import FinalInvitation from './components/FinalInvitation';
import FinalFrame from './components/FinalFrame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [experienceVisible, setExperienceVisible] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  useLenis();

  return (
    <>
      <MusicPlayer />

      {!introComplete && (
        <EnvelopeIntro
          onReveal={() => setExperienceVisible(true)}
          onComplete={() => {
            setExperienceVisible(true);
            setIntroComplete(true);
          }}
        />
      )}

      <main
        className="wedding-film"
        style={{
          opacity: experienceVisible ? 1 : 0,
          transition: 'opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <OpeningScene isActive={introComplete} />
        <NamesScene />
        <div className="gradient-navy-to-ivory" aria-hidden="true" />
        <CeremonyScene />
        <ReceptionScene />
        <div className="gradient-ivory-to-navy" aria-hidden="true" />
        <DateSequence />
        <PhotoStory />
        <FinalInvitation />
        <FinalFrame />
      </main>
    </>
  );
}
