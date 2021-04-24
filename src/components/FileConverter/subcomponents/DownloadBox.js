import React from 'react';

import './DownloadBox.css';

const DownloadBox = props => {

    return(
        <div className="box-wrapper">
            <img id="excel" className="img-type-logo" src={props.output ? props.output : process.env.PUBLIC_URL + '/XLSX-file.svg'} alt="Input"/>
            <label id="download" className={props.file ? "" : "disabled"}> 
                <button
                    disabled={!props.file}
                    onClick={props.onClick}/> 
                Download
            </label>
        </div>
    );
}

export default DownloadBox;