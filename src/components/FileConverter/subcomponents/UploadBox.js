import React from 'react';

import './UploadBox.css';

const UploadBox = props => {

    let imageProps = props.input ? 
        {
            className: "input-preview",
            src: props.input
        } : 
        {
            className: "img-type-logo",
            src: process.env.PUBLIC_URL + '/IMG-file.svg'
        };
    
    return(
        <div className="box-wrapper">
            {props.input && <span className="close" onClick={props.onClear}></span>}
            <img id="input" {... imageProps} alt="Input"/>
            <label id="upload" className={props.input ? "disabled" : ""}> 
                <input 
                    disabled={!!props.input}
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={props.onChange}/> 
                Upload
            </label>
        </div>
    );
}

export default UploadBox;