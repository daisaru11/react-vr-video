

export class BaseVideo {

	constructor(options) {
		this.videoElem = null;

		const defaultOptions = {
			autoplay: true,
		};

		this.options = Object.assign({}, options, defaultOptions);
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
	}

	getRenderableElement() {
		return this.videoElem;
	}

	getVideoElement() {
		return this.videoElem;
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

