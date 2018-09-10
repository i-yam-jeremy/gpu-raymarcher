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
 * A mixin for handling events
 *
 * Usage:
 * 	class YourClassName implements EventHandler {
 * 		...
 * 	}
 *	applyMixins(YourClassName, [EventHandler]);
 */
export class EventHandler {

	/*
	 * Stores event listener callbacks by event type
	 */
	private eventListeners: { [eventType: string]: EventCallback[]  } = {};

	/*
	 * Get all event listener callbacks of the given event type
	 *
	 * @param eventType - the type of event to get callbacks for
	 * @return - the event callbacks of the given type currently bound to this object
	 *
	 */
	protected getEventListeners(eventType: string): EventCallback[] {
		return this.eventListeners[eventType];
	}

	/*
	 * Bind an event listener callback to this object to listen for events of the
	 * specified type
	 *
	 * @param eventType - the type of event the callback is listening for
	 * @param callback - called when an event of the specified type is received by this object
	 */
	public addEventListener(eventType: string, callback: EventCallback) {
		if (!(eventType in this.eventListeners)) {
			this.eventListeners[eventType] = [];
		}
		this.eventListeners[eventType].push(callback);
	}
	
}


