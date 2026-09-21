import ceremonyReference from '../assets/ceremony-reference.png';

const CHURCH_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Church+of+Archangel+Michael+Sheraton+Cairo';

export default function CeremonyScene() {
  return (
    <section className="ceremony-reference-scene">
      <div className="ceremony-reference-art">
        <img
          src={ceremonyReference}
          alt="Bishoy & Doris wedding ceremony details"
          draggable="false"
        />

        {/* Invisible functional hit area over the exact VIEW ON MAPS button */}
        <a
          href={CHURCH_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ceremony-map-hitbox"
          aria-label="View Church of Archangel Michael on Maps"
        />
      </div>
    </section>
  );
}
