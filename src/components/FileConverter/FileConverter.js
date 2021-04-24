import React, {Component} from 'react';
import * as Excel from 'exceljs';
import { saveAs } from 'file-saver';

import UploadBox from './subcomponents/UploadBox';
import DownloadBox from './subcomponents/DownloadBox';

import "./FileConverter.css";

class FileConverter extends Component {
	
	state = {
		input: null,
		output: null,
		file: null,
		name: null
	};

	/** upload image function */
	handleFileChange = event => {

		/** if no files, clear state and return */
		if(event.target.files.length === 0){
			this.handleClearUpload();
			return;
		} 

		const reader = new FileReader();

		/** get image as base64 */
		reader.readAsDataURL(event.target.files[0]);
		/** save name in state so we can reference it when exporting the excel file */
		this.setState({name: event.target.files[0].name.replace(/\.[^/.]+$/, "")});
		
		/** save input image on state */
		reader.onload = function(e) {
			this.setState({input: e.target.result});
		}.bind(this);
	}

	/** Clear all state */
	handleClearUpload = () => {
		this.setState({	input: null,
						output: null,
						file: null,
						name: null});
	}

	handleImageProcessing = () => {
		const { input } = this.state;
		
		/** checking for empty files */
		if (!input) return;
		
		/** create an image element with the uploaded file */
		const imgElement = document.createElement("img");
		imgElement.src = input;

		/** when the image loads... */
		imgElement.onload = function(evt){
			
			/** create a canvas with the resized with and height */
			const canvas = document.createElement("canvas");
			const MAX_WIDTH = 100;
			const resizeScale = MAX_WIDTH / evt.target.width;
			canvas.width = MAX_WIDTH;
			canvas.height = evt.target.height * resizeScale;
			
			/** draw the uploaded image onto the resized canvas */
			const ctx = canvas.getContext("2d");
			ctx.drawImage(evt.target,0,0,canvas.width,canvas.height);
			
			/** get resized image data */
			const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
			const srcEncoded = ctx.canvas.toDataURL(evt.target, "image/jpeg");
			const pixelData = imgData.data;

			/** create a new excel file */
			let wb = new Excel.Workbook();
			let ws = wb.addWorksheet('sheet');
			
			/** resize columns so the cells look more like pixels */
			for (let column = 1; column <= 100; column++) {
				ws.getColumn(column).width = 3;
			}

			let row = ws.getRow(1);;
			let row_id = 1;
			let cell_id = 1;
			for (let i = 0; i < pixelData.length; i = i + 4){
				/** for each pixel in the image, assign it's argb values to the appropriate cell in the table */
				row.getCell(cell_id).fill = {
					type: 'pattern',
					pattern:'solid',
					fgColor:{
						argb: 
							this.intToHex(pixelData[i + 3]) +
							this.intToHex(pixelData[i]) +
							this.intToHex(pixelData[i + 1]) +
							this.intToHex(pixelData[i + 2])},
				};
				if(cell_id === 100){
					cell_id = 1;
					row_id++;
					row = ws.getRow(row_id);
				}else{
					cell_id++;
				}
			}
			/** save output and file data in state */
			this.setState({output: srcEncoded, file: wb})
			
		}.bind(this);
	}

	/** save excel file with the original image name */
	handleDownload = () => {
		const { file, name } = this.state;
		this.saveFile(name, file);
	}

	/** convert a number value to a hex based string (padding out the 0s) */
	intToHex(number){
		let hex = number.toString(16);
		while (hex.length < 2) hex = '0' + hex;
		return hex;
	}

	/** helper function for saving the excel file */
	async saveFile (fileName, workbook) {
		const xls64 = await workbook.xlsx.writeBuffer({ base64: true })
		saveAs(
		  new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
		  fileName
		)
	  }

    render() {
        const {input, output, file} = this.state;

        return (
            <div>
                <div className="converter-container">
                    <section className="uploader">
						<UploadBox input={input} onChange={this.handleFileChange} onClear={this.handleClearUpload}/>
                    </section>
                    <section className="downloader">
                        <DownloadBox output={output} file={file} onClick={this.handleDownload}/>
                    </section>
					<button id="process" className={(!input || !!file) ? "disabled": ""} disabled={(!input || !!file)} onClick={this.handleImageProcessing}>Process</button>  
                </div>
            </div>
        )
    }
}

export default FileConverter;