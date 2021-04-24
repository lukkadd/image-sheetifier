import React, {Component} from 'react';

import Title from '../Title/Title';
import FileConverter from '../FileConverter/FileConverter';

import './App.css';

class App extends Component {

	render() {
		
		return (
			<div className="App">
				<div className="App-wrapper">
					<Title />
					<FileConverter />
				</div>
			</div>
			);
	}
}
	
export default App;
	