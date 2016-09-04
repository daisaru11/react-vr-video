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
					<div className={styles.seek}>
					</div>
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

	return (
		<div className={styles.play_toggle}>
			<div className={styles.icon +' '+ sIcon} />
		</div>
	);
};

export default PlayerControl;
