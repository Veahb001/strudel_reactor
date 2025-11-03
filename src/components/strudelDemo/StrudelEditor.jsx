export default function StrudelEditor({ label, value, onChange, readOnly = false }) {
  return (
    <div className="strudel-editor">
      <label className="form-label">{label}</label>
      <textarea
        className="form-control strudel-textarea"
        rows="50"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{ color: '#fff' }}
      />
    </div>
  );
}
