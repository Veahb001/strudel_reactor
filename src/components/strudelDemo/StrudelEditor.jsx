export default function StrudelEditor({ label, value, onChange, readOnly = false }) {
  return (
    <div className="strudel-editor">
      <label className="form-label">{label}</label>
      <textarea
        className="form-control strudel-textarea"
        rows="18"
        value={value}
      />
    </div>
  );
}
