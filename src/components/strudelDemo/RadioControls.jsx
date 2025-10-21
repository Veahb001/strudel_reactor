export default function RadioControls ({ onChange }) {
    return(
        <div className="col-md-4">
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked onChange={onChange} />
                <label>
                    p1: ON
                </label>
            </div>
            <div className="form-input-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={onChange}/>
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    p1: HUSH
                </label>
            </div>
        </div>
    );
}