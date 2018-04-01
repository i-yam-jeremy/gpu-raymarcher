/*
 * All events must implement this interface
 */
export interface Event {

	/*
	 * The type of event
	 */
	readonly eventType: string;
	/*
	 * The time this event occurred
	 */
	readonly time: number;
	/*
	 * The object that caused this event
	 * Can be undefined if the event was
	 * not caused by an object 
	 *
	 * Example of event caused by an object:
	 * 	Collision between two 3D objects,
	 * 		each object receives a collision event and
	 * 		the source is the other object because 
	 * 		that is what hit it
	 * 
	 * Example of event not cause by an object:
	 * 	Mouse click,
	 * 		the object that was clicked receives a click event
	 * 		but no object caused that, it was just a mouse that
	 * 		caused it, so the source will be undefined
	 *
	 */
	readonly source: any;

}

/*
 * A callback for listening to events
 */
export type EventCallback = (e: Event) => void;

/*
 * FIXME try to find some way to make this an interface (or export a function called makeEvenetListener that can be used in the constructor of the object to make that object an event listener via mixin stuff)
 */
export class EventHandlerBackup {

	private eventHandlers: { [eventType: string]: EventCallback[]  } = {};

	protected getEventListeners(eventType: string): EventCallback[] {
		return this.eventHandlers[eventType];
	}

	public addEventListener(eventType: string, callback: EventCallback) {
		if (!(eventType in this.eventHandlers)) {
			this.eventHandlers[eventType] = [];
		}
		this.eventHandlers[eventType].push(callback);
	}
	
}



