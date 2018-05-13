import {GraphicsEngine} from "../engine";

/* Called every graphics engine tick */
export type TickCallback = (deltaTime: number) => void;
/* Called every frame */
export type RenderCallback = () => void;

/*
 * Manages graphics engine tick rate and framerate
 */
export class Ticker {

	/* tracks the framerate */
	private fpsTracker: FPSTracker;
	/* called every graphics engine tick */
	private tickCallback: TickCallback;
	/* called every frame */
	private renderCallback: RenderCallback;
	/* the time at the start of the last frame */
	private lastFrameTime: number;
	/* the number of seconds per tick */
	private tickStep: number;
	/* the number of seconds of not-yet-ticked time */
	private tickAccumulator: number;
	/* whether or not this ticker is running */
	private running: boolean;

	/*
	 * @param tickCallback - called every graphics engine tick
	 * @param renderCallback - called every frame
	 * @param tickRate - the number of graphics engine ticks per second
	 *
	 */
	constructor(tickCallback: TickCallback, renderCallback: RenderCallback, tickRate=180) {
		this.fpsTracker = new FPSTracker();
		this.tickCallback = tickCallback;
		this.renderCallback = renderCallback;
		this.tickStep = 1 / tickRate;
		this.tickAccumulator = 0;
		this.running = false;
	}

	/* starts the ticker */
	public start(): void {
		this.running = true;
		this.lastFrameTime = Date.now();
		window.requestAnimationFrame(() => this.frameLoop());
	}

	/* stops the ticker */
	public stop(): void {
		this.running = false;
	}

	/* 
	 * @return whether or not the ticker is running
	 */
	public isRunning(): boolean {
		return this.running;
	}

	/*
	 * @return the current framerate
	 */
	public getFPS(): number {
		return this.fpsTracker.getFPS();
	}

	/*
	 * loops and calls tickCallback and renderCallback accordingly
	 */
	private frameLoop(): void {
		if (this.running) {
			const frameStartTime = Date.now();

			this.fpsTracker.frame();

			this.tickAccumulator += (frameStartTime - this.lastFrameTime) / 1000;
			while (this.tickAccumulator > this.tickStep) {
				this.tickCallback(this.tickStep);
				this.tickAccumulator -= this.tickStep;
			}

			this.renderCallback();

			this.lastFrameTime = frameStartTime;

			window.requestAnimationFrame(() => this.frameLoop());
		}
	}

}

/*
 * Tracks the framerate
 */
class FPSTracker {

	/* the last time the framerate was updated */
	private lastUpdateTime: number;
	/* the number of frames that have occurred since the framerate was last updated */
	private framesSinceLastUpdate: number;
	/* how often (in milliseconds) to update the framerate (the framerate isn't updated every frame in order to prevent noise) */
	private updateInterval: number;
	/* the last calculated framerate */
	private fps: number;

	/*
	 * @param updateInterval - how often (in milliseconds) to update the framerate
	 */
	constructor(updateInterval=1000) {
		this.updateInterval = updateInterval;
		this.lastUpdateTime = Date.now();
		this.framesSinceLastUpdate = 0;
		this.fps = 0;
	}

	/*
	 * Should be called once per frame
	 * Updates the framerate every update interval
	 */
	public frame(): void {
		this.framesSinceLastUpdate++;

		const now = Date.now();
		if (now - this.lastUpdateTime > this.updateInterval) {
			const secondsSinceLastUpdate = (now - this.lastUpdateTime) / 1000;
			this.fps = this.framesSinceLastUpdate / secondsSinceLastUpdate;
			this.framesSinceLastUpdate = 0;
			this.lastUpdateTime = now;
			console.log(this.fps);
		}     
	}

	/*
	 * @return the last calculated framerate
	 */
	public getFPS(): number {
		return this.fps;
	}

}
