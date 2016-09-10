import THREE from 'three';

/**
 * Manage pose of camera  by aggregating some device events.
 */
export class CameraControls {

	constructor() {
		this.controls = [];
		this.pose = new THREE.Quaternion();
	}

	addControl(control) {
		this.controls.push(control);
	}

	update() {
		for (let i=0; i<this.controls.length; ++i) {
			this.controls[i].update();
		}

		this.pose.x = 0;
		this.pose.y = 0;
		this.pose.z = 0;
		this.pose.w = 1;
		for (let i=0; i<this.controls.length; ++i) {
			const pose = this.controls[i].getPose();
			this.pose.multiply(pose);
		}

		this.adjust();
	}

	adjust() {
		const angleV = Math.atan2(2 * (this.pose.w * this.pose.x - this.pose.y * this.pose.z),  1 - 2 * (this.pose.x*this.pose.x + this.pose.z*this.pose.z));

		let over = 0;
		let needsAdjust = false;
		if ( angleV > (+ Math.PI * 0.5) ) {
			over = angleV - Math.PI * 0.5;
			needsAdjust = true;
		}
		if ( angleV < (- Math.PI * 0.5) ) {
			over = angleV - Math.PI * 0.5;
			needsAdjust = true;
		}
		if (needsAdjust) {
			for (let i=0; i<this.controls.length; ++i) {

				// find a control which is able to adjust the angle offset.
				if (this.controls[i].adjustFeedback && this.controls[i].adjustFeedback(over) ) {

					const axisV = this.__update_axisV ? this.__update_axisV : new THREE.Vector3(1, 0, 0); // cache
					const qV = this.__update_qV ? this.__update_qV : new THREE.Quaternion(); // cache
					qV.setFromAxisAngle(axisV, -over);

					this.pose.multiply(qV);
					break;
				}
			}
		}

	}

	getPose() {
		return this.pose;
	}

	dispose() {
		for (let i=0; i<this.controls.length; ++i) {
			this.controls[i].dispose();
		}
	}
}

/**
 * Control Mouse/Touch events.
 */
export class TouchContol {

	constructor(domElement) {
		this.domElement = domElement;
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);

		this.rotPrev = new THREE.Vector2();
		this.rotCurrent = new THREE.Vector2();
		this.rotDelta = new THREE.Vector2();
		this.rotUpdated = false;

		this.angleH = 0;
		this.angleV = 0;
		this.pose = new THREE.Quaternion();

		this.rotVelocityH = 0.5;
		this.rotVelocityV = 0.5;

		this.state = TouchContol.State.None;
		this.movingEventCount = 0;

		this.addEventListeners();
	}

	dispose() {
		this.removeEventListeners();
	}

	setState(s) {
		this.state = s;
	}

	isState(s) {
		return this.state == s;
	}

	addEventListeners() {
		if (!this.domElement) {
			return;
		}

		this.domElement.addEventListener( 'mousedown', this.onMouseDown, true );
		this.domElement.addEventListener( 'mouseup', this.onMouseUp, true );
		this.domElement.addEventListener( 'mousemove', this.onMouseMove, true );
	}

	removeEventListeners() {
		if (!this.domElement) {
			return;
		}

		this.domElement.removeEventListener( 'mousedown', this.onMouseDown, true );
		this.domElement.removeEventListener( 'mouseup', this.onMouseUp, true );
		this.domElement.removeEventListener( 'mousemove', this.onMouseMove, true );
	}

	onMouseDown(event) {
		if (this.isState(TouchContol.State.None) == false) {
			return;
		}

		this.setState(TouchContol.State.Moving);
		this.movingEventCount = 0;
	}

	onMouseMove(event) {
		if (this.isState(TouchContol.State.Moving) == false) {
			return;
		}

		this.rotCurrent.set(event.screenX, event.screenY);

		if (this.movingEventCount > 0) { // skip first event
			this.rotDelta.subVectors( this.rotCurrent, this.rotPrev );

			this.rotUpdated = true;
		}

		this.movingEventCount ++;
		this.rotPrev.copy(this.rotCurrent);
	}

	onMouseUp(event) {
		if (this.isState(TouchContol.State.Moving) == false) {
			return;
		}

		this.setState(TouchContol.State.None);
	}

	update() {
		if (this.isState(TouchContol.State.Moving) && this.rotUpdated) {
			const rotateH = 2 * Math.PI * this.rotDelta.x / this.domElement.clientWidth * this.rotVelocityH;
			const rotateV = 2 * Math.PI * this.rotDelta.y / this.domElement.clientHeight * this.rotVelocityV;

			this.angleH += rotateH;
			this.angleV += rotateV;

			const axisH = this.__update_axisH ? this.__update_axisH : new THREE.Vector3(0, 1, 0); // cache
			const axisV = this.__update_axisV ? this.__update_axisV : new THREE.Vector3(1, 0, 0); // cache

			this.pose.setFromAxisAngle(axisH, this.angleH);

			const qV = this.__update_qV ? this.__update_qV : new THREE.Quaternion(); // cache
			qV.setFromAxisAngle(axisV, this.angleV);

			this.pose.multiply(qV);

			this.rotUpdated = false;
		}
	}

	adjustFeedback(angleV) {
		this.angleV -= angleV;
		return true;
	}

	getPose() {
		return this.pose;
	}
}

TouchContol.State = {
	None: 0,
	Moving: 1,
};

