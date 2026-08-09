import { useState } from 'react';
import useLenis from './hooks/useLenis';
import EnvelopeIntro from './components/EnvelopeIntro';
import OpeningScene from './components/OpeningScene';
import NamesScene from './components/NamesScene';
import CeremonyScene from './components/CeremonyScene';
import ChurchEntrance from './components/ChurchEntrance';
import CelebrationTransition from './components/CelebrationTransition';
import ReceptionScene from './components/ReceptionScene';
import DateSequence from './components/DateSequence';
import Countdown from './components/Countdown';
import PhotoStory from './components/PhotoStory';
import InvitationMessage from './components/InvitationMessage';
import FinalInvitation from './components/FinalInvitation';
import FinalFrame from './components/FinalFrame';
import AtmosphericParticles from './components/GoldenParticles';
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

      {experienceVisible && <AtmosphericParticles />}
      <div className="film-grain" />
      <div className="vignette" />

      <main
        style={{
          opacity: experienceVisible ? 1 : 0,
          transform: experienceVisible ? 'none' : 'scale(1.01)',
          transition: 'opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1), transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <OpeningScene isActive={introComplete} />
        <NamesScene />
        <CeremonyScene />
        <ChurchEntrance />
        <CelebrationTransition />
        <ReceptionScene />
        <DateSequence />
        <Countdown />
        <PhotoStory />
        <InvitationMessage />
        <FinalInvitation />
        <FinalFrame />
      </main>
    </>
  );
}
