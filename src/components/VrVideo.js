import React from 'react';
import styles from './VrVideo.css';

import Renderer from './Renderer';
import PlayerControl from './PlayerControl';
import {factory} from '../libs/Video';
import {CameraControls} from '../libs/CameraControls';

class VrVideo extends React.Component {
	constructor(props) {
		super(props);

		this.video = factory();
		if (props.src) {
			this.video.addSource(props.src);
		}

		this.cameraControls = new CameraControls();
	}

	componentDidMount() {
		if (this.refs.renderer) {
			this.cameraControls.addControl(this.refs.renderer.getTouchControl());
		}

		this.startAnimationLoop();
	}

	componentWillUnmount() {
		this.cameraControls.dispose();
		this.stopAnimationLoop();
	}

	startAnimationLoop() {
		cancelAnimationFrame(this.animationFrameId);
		this.updateAnimationLoop();
	}
	
	stopAnimationLoop() {
		cancelAnimationFrame(this.animationFrameId);
	}

	updateAnimationLoop() {
		this.cameraControls.update();

		this.animationFrameId = requestAnimationFrame(this.updateAnimationLoop.bind(this));
	}

	render() {
		return (
			<div className={styles.container}>
				<Renderer video={this.video} cameraControls={this.cameraControls} ref='renderer' />
				<PlayerControl video={this.video} cameraControls={this.cameraControls} ref='playerControl' />
			</div>
		);
	}
}

VrVideo.propTypes = {
	src: React.PropTypes.string,
};

export default VrVideo;
