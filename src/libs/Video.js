import EventEmitter from 'events';

export class BaseVideo {

	constructor(options) {
		this.videoElem = null;

		this.eventEmitter = new EventEmitter();
		this.domEventRemovers = [];

		const defaultOptions = {
			autoplay: true,
		};

		this.options = Object.assign({}, options, defaultOptions);
	}

	dispose() {
		for (let i=0; i<this.domEventRemovers.length; ++i) {
			this.domEventRemovers[i]();
		}
		this.domEventRemovers.length = 0;

		if ( this.videoElem ) {
			delete this.videoElem;
		}

		this.eventEmitter.removeAllListeners();
	}

	addListener(eventName, listener) {
		this.eventEmitter.addListener(eventName, listener);
	}

	removeListener(eventName, listener) {
		this.eventEmitter.removeListener(eventName, listener);
	}

	addDOMEventProxy(elem, eventName) {
		const emitter = () => {
			this.eventEmitter.emit(eventName);
		};

		elem.addEventListener(eventName, emitter);
		const remover = () => {
			elem.removeEventListener(eventName, emitter);
		};
		
		this.domEventRemovers.push(remover);
	}

	addSource(src) {
		this.createVideoElement();

		const source = document.createElement('source');
		source.src = src;

		this.videoElem.appendChild(source);
	}

	createVideoElement() {
		if (this.videoElem != null) {
			return;
		}

		this.videoElem = document.createElement('video');
		this.videoElem.autoplay = this.options.autoplay;

		this.addDOMEventProxy(this.videoElem, 'canplay');
		this.addDOMEventProxy(this.videoElem, 'loadedmetadata');
		this.addDOMEventProxy(this.videoElem, 'durationchange');
		this.addDOMEventProxy(this.videoElem, 'play');
		this.addDOMEventProxy(this.videoElem, 'pause');
		this.addDOMEventProxy(this.videoElem, 'ended');
		this.addDOMEventProxy(this.videoElem, 'timeupdate');
		this.addDOMEventProxy(this.videoElem, 'seeking');
		this.addDOMEventProxy(this.videoElem, 'volumechange');
	}

	getRenderableElement() {
		return this.videoElem;
	}

	getVideoElement() {
		return this.videoElem;
	}

	play() {
		if (this.videoElem) {
			this.videoElem.play();
		}
	}

	pause() {
		if (this.videoElem) {
			this.videoElem.pause();
		}
	}

	isPaused() {
		if (this.videoElem) {
			return this.videoElem.paused;
		}
		return true;
	}

	getDuration() {
		if (this.videoElem) {
			return this.videoElem.duration;
		}
		return 0;
	}

	getCurrentTime() {
		if (this.videoElem) {
			return this.videoElem.currentTime;
		}
		return 0;
	}

	setCurrentTime(time) {
		if (this.videoElem) {
			this.videoElem.currentTime = time;
		}
	}


}

export class BasicVideo extends BaseVideo {

	constructor() {
		super();
	}

}

export function factory() {
	return new BasicVideo();
}

