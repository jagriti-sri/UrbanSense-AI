import './VoiceFab.css';

export default function VoiceFab() {
  return (
    <button
      className="voice-fab"
      type="button"
      onClick={() => alert('Voice assistant placeholder. Connect your speech feature here.')}
      aria-label="Open voice assistant"
    >
      🎙️
    </button>
  );
}
