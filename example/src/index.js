import React from 'react';
import ReactDOM from 'react-dom';

import VrVideo from '../../';

class Main extends React.Component {
	render() {
		return (
				<div>
					<h1>Example</h1>
					<div style={{width:'400px', height:'300px'}}>
						<VrVideo src='../sample-01.mp4' />
					</div>
				</div>
		);
	}
}

ReactDOM.render(
	<Main />,
	document.getElementById('main')
);

