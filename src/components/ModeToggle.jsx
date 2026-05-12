export default function ModeToggle({ mode, setMode }) {
  const isDesigner = mode === "designer";

  return (
    <div className="mode-toggle">
      <div className="mode-toggle-label">Current Mode</div>
      <div className="mode-toggle-buttons">
        <button
          type="button"
          className={isDesigner ? "mode-button active" : "mode-button"}
          onClick={() => setMode("designer")}
        >
          Curriculum Designer
        </button>
        <button
          type="button"
          className={!isDesigner ? "mode-button active" : "mode-button"}
          onClick={() => setMode("learner")}
        >
          Learner
        </button>
      </div>
      <p className="mode-helper-text">
        {isDesigner ? "Build and customize the curriculum." : "Experience the learning pathway."}
      </p>
    </div>
  );
}
