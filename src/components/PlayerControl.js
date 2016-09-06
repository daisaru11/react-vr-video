import React from 'react';

import styles from './PlayerControl.css';

import {BaseVideo} from '../libs/Video';

const PlayerState = {
	None: 0,
	Paused: 1,
	Playing: 2,
	Ended: 3
};

class PlayerControl extends React.Component {
	constructor(props) {
		super(props);

		this.onVideoPlay = this.onVideoPlay.bind(this);
		this.onVideoPause = this.onVideoPause.bind(this);

		this.state = {
			playerState: PlayerState.None,
		};
	}

	componentDidMount() {

		this.props.video.addListener('play', this.onVideoPlay);
		this.props.video.addListener('pause', this.onVideoPause);

		if (this.props.video.isPaused()) {
			this.setState({playerState: PlayerState.Paused});
		} else {
			this.setState({playerState: PlayerState.Playing});
		}
	}

	componentWillUnmount() {
		this.props.video.removeListener('play', this.onVideoPlay);
		this.props.video.removeListener('pause', this.onVideoPause);
	}

	onVideoPlay() {
		this.setState({playerState: PlayerState.Playing});
	}

	onVideoPause() {
		this.setState({playerState: PlayerState.Paused});
	}

	render() {
		const props = Object.assign({}, this.props, this.state);
		return (
			<div className={styles.container}>
				<div className={styles.bottombar}>
					<PlayToggleButton {...props} />
					<SeekBar {...props} />
				</div>
			</div>
		);
	}
}

PlayerControl.propTypes = {
	video: React.PropTypes.instanceOf(BaseVideo),
};

const PlayToggleButton = (props) => {
	let sIcon = styles.icon_play;
	if (props.playerState == PlayerState.Playing) {
		sIcon = styles.icon_pause;
	}

	const onClick = () => {
		if (props.video.isPaused()) {
			props.video.play();
		} else {
			props.video.pause();
		}
	};

	return (
		<div className={styles.play_toggle} onClick={onClick} >
			<div className={styles.icon +' '+ sIcon} />
		</div>
	);
};

class SeekBar extends React.Component {
	constructor(props) {
		super(props);

		this.onInterval = this.onInterval.bind(this);
	}

	componentDidMount() {
		this.intervalId = window.setInterval(this.onInterval, 200);
	}

	componentWillUnmount() {
		window.clearInterval(this.intervalId);
	}

	onInterval() {
		const duration = this.props.video.getDuration();
		const current = this.props.video.getCurrentTime();
		const rate = duration < 1 ? 0 : current / duration;
		this.refs.gauge_fill.style.width = (rate * 100) + '%';
	}

	render() {
		return (
			<div className={styles.seekbar}>
				<div className={styles.gauge}>
					<div className={styles.gauge_fill} ref='gauge_fill'>
					</div>
				</div>
			</div>
		);
	}
}

export default PlayerControl;
