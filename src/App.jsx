import { useState } from 'react';
import useLenis from './hooks/useLenis';
import useSceneDirector from './hooks/useSceneDirector';
import EnvelopeIntro from './components/EnvelopeIntro';
import NamesScene from './components/NamesScene';
import CeremonyScene from './components/CeremonyScene';
import ReceptionScene from './components/ReceptionScene';
import DateSequence from './components/DateSequence';
import PhotoStory from './components/PhotoStory';
import FinalInvitation from './components/FinalInvitation';
import MusicPlayer from './components/MusicPlayer';
import { getAppVariant } from './utils/variant';

export default function App() {
  const [variant] = useState(getAppVariant);
  const [experienceVisible, setExperienceVisible] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  useLenis();
  // One intentional gesture = one cinematic scene (enabled after the envelope).
  useSceneDirector(introComplete);

  const isChurch = variant === 'church';

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
        <NamesScene />
        <CeremonyScene variant={variant} />
        {!isChurch && <ReceptionScene />}
        <DateSequence />
        <PhotoStory />
        <FinalInvitation variant={variant} />
      </main>
    </>
  );
}
