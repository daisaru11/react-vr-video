import React from 'react';
import THREE from 'three';
import styles from './Renderer.css';

import {BaseVideo} from '../libs/Video';

class Renderer extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.createRenderer();
		this.startAnimationLoop();
	}

	componentWillUnmount() {
		this.disposeRenderer();
		this.stopAnimationLoop();
	}

	createRenderer() {
		const size = this.getContainerSize();

		const canvas = this.refs.rendererCanvas;

		const camera = new THREE.PerspectiveCamera( 45, size.width / size.height, 1, 1100 );
		camera.target = new THREE.Vector3( 0, 0, 0 );

		const scene = new THREE.Scene();

		const geometry = new THREE.SphereGeometry( 500, 60, 40 );
		geometry.scale( - 1, 1, 1 );

		const videoTexture = new THREE.Texture( this.props.video.getRenderableElement() );
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBFormat;
		videoTexture.generateMipmaps = false;

		const material   = new THREE.MeshBasicMaterial( { map : videoTexture } );

		const mesh = new THREE.Mesh( geometry, material );
		mesh.rotation.set(0, -Math.PI/2, 0);

		scene.add( mesh );

		const renderer = new THREE.WebGLRenderer({
			canvas: canvas
		});
		renderer.setPixelRatio( window.devicePixelRatio );

		this.three = {
			camera: camera,
			scene: scene,
			videoTexture: videoTexture,
			renderer: renderer,

			dispose: () => {
				videoTexture.dispose();
				material.dispose();
				geometry.dispose();
				renderer.dispose();
			},
		};

		this.updateRendererSize();
	}

	disposeRenderer() {
		if ( this.three ) {
			this.three.dispose();
			delete this.three;
		}
	}

	updateRendererSize() {
		const size = this.getContainerSize();

		this.refs.rendererCanvas.style.width = size.width +'px';
		this.refs.rendererCanvas.style.height = size.height +'px';

		if (this.three) {
			this.three.renderer.setSize(size.width, size.height);
			this.three.camera.aspect = size.width / size.height;
			this.three.camera.fov = 70;
			this.three.camera.updateProjectionMatrix();
		}
	}

	getContainerSize() {
		const width = this.refs.container.offsetWidth;
		const height = this.refs.container.offsetHeight;

		return {
			width,
			height,
		};
	}

	startAnimationLoop() {
		cancelAnimationFrame(this.animationFrameId);
		this.updateAnimationLoop();
	}
	
	stopAnimationLoop() {
		cancelAnimationFrame(this.animationFrameId);
	}

	updateAnimationLoop() {

		if ( this.three ) {

			let videoElem = this.props.video.getVideoElement();
			if ( videoElem.readyState >= videoElem.HAVE_CURRENT_DATA ) {
				this.three.videoTexture.needsUpdate = true;
			}

			const size = this.getContainerSize();
			this.three.renderer.setViewport( 0, 0, size.width, size.height );
			this.three.renderer.render( this.three.scene, this.three.camera );
		}

		this.animationFrameId = requestAnimationFrame(this.updateAnimationLoop.bind(this));
	}

	render() {
		return (
			<div className={styles.container} ref='container'>
				<canvas className={styles.renderer} ref='rendererCanvas' />
			</div>
		);
	}
}

Renderer.propTypes = {
	video: React.PropTypes.instanceOf(BaseVideo),
};

export default Renderer;
