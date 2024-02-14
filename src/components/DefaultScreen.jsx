import noProjectImage from '../assets/noProjectImage.png';

export default function DefaultScreen() {
  return (
    <div>
      <img src={noProjectImage} alt="An empty task list" />
      <h2>No Project Selected</h2>
      <p>Select a project or get started with a new one</p>
      <p>
        <button>Create new project</button>
      </p>
    </div>
  );
}
