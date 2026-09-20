import { eventConfig } from '../config/eventConfig';

export default function FinalInvitation() {
  return (
    <section className="ff-scene canvas-navy">
      <div className="ff-inner">
        <h2 className="ff-names">{eventConfig.groomName} &amp; {eventConfig.brideName}</h2>
        <p className="ff-message">We look forward to sharing our beginning with you.</p>
        
        <div className="lux-rule ff-rule" />
        
        <p className="ff-date">14 &middot; 11 &middot; 2026</p>
        <div className="ff-recap">
          <p>Archangel Michael Church</p>
          <p>La Pensée, Gardenia</p>
        </div>
        
        <div className="ff-seal">
          <span>B</span><span className="ff-seal-amp">&amp;</span><span>D</span>
        </div>
        
        <p className="ff-signoff">See you there.</p>
        
        <div className="ff-ctas">
          <a href="#" className="ff-link">Add to Calendar</a>
          <span className="ff-dot">&middot;</span>
          <a href={eventConfig.reception.mapUrl} className="ff-link" target="_blank" rel="noopener noreferrer">View Map</a>
        </div>
      </div>
    </section>
  );
}
