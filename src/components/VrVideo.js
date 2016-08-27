import React from 'react';
import styles from './VrVideo.css';

import Renderer from './Renderer';
import {factory} from '../libs/Video';

class VrVideo extends React.Component {
	constructor(props) {
		super(props);

		this.video = factory();
		if (props.src) {
			this.video.addSource(props.src);
		}
	}

	render() {
		return (
			<div className={styles.container}>
				<Renderer video={this.video} />
			</div>
		);
	}
}

VrVideo.propTypes = {
	src: React.PropTypes.string,
};

export default VrVideo;
