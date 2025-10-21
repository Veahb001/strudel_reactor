export default function StrudelEditor({ value, onChange }) {
    return (
        <div className="col-md-8" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                <label className="form-label">Text to preprocess:</label>
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Text to preprocess:</label>
                        <textarea className="form-control" rows="15" value={value} onChange={(e) => onChange(e.target.value)} ></textarea>
                    </div>
        );
}