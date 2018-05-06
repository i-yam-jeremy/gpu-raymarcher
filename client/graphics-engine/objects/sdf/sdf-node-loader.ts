import {SDFNode, SDFNodeData} from "./sdf-node";

import {ConstantNode} from "./basic/constant";
import {Sphere} from "./basic/sphere";

/* a function that creates an SDFNode from given SDFNodeData */
type SDFNodeCreator = (nodeData: SDFNodeData) => SDFNode;

/* the table mapping node names to their respective creator function */
const NODE_TABLE: { [nodeName: string] : SDFNodeCreator } = {
	"sphere": Sphere.create
};

/*
 * Loads SDF node objects from JSON and node data
 */
export class SDFNodeLoader {

	/*
	 * Converts SDF node data to an SDF node
	 *
	 * @param nodeData - the data specifying type and additional parameters relating
	 * 			to the SDF node
	 *
	 * @return - the created SDF node
	 */
	public static fromDataObject(nodeData: SDFNodeData): SDFNode {
		if (nodeData['type'] in NODE_TABLE) {
			for (let key in nodeData) {
				if (typeof nodeData[key] == 'object' && 'type' in nodeData[key]) {
					nodeData[key] = SDFNodeLoader.fromDataObject(nodeData[key]);
				}
				else if (typeof nodeData[key] != 'string' && typeof nodeData[key] != 'object') {
					nodeData[key] = new ConstantNode(nodeData[key]);
				}
			}
			return NODE_TABLE[nodeData['type']](nodeData);
		}
	}

	/*
	 * Converts a JSON string to an SDF node
	 *
	 * @param jsonString - the JSON string containing the node data
	 * 
	 * @return - the created SDF node
	 */
	public static fromJSON(jsonString: string): SDFNode {
		try {
			var nodeData = JSON.parse(jsonString);
			return SDFNodeLoader.fromDataObject(nodeData);
		} catch (e) {
			console.error(e);
		}
	}
}
