import {SDFNode, SDFNodeData} from "./sdf-node";

import {ConstantNode} from "./basic/constant";
import {Sphere} from "./basic/sphere";
import {SpecialInput} from "./basic/special-input";
import {Custom} from "./basic/custom";
import {SimpleDistortion} from "./basic/simple-distortion";

/* a function that creates an SDFNode from given SDFNodeData */
type SDFNodeCreator = (nodeData: SDFNodeData) => SDFNode;

/* the table mapping node names to their respective creator function */
const NODE_TABLE: { [nodeName: string] : SDFNodeCreator } = {
	"sphere": Sphere.create,
	"special-input": SpecialInput.create,
	"custom": Custom.create,
	"simple-distortion": SimpleDistortion.create
};

/*
 * Loads SDF node objects from JSON and node data
 */
export class SDFNodeLoader {

	/*
	 * Converts this node data dictionary to SDF nodes where applicable.
	 * It does this recursively on all fields on the node data dictionary, starting from leafs and building up from there.
	 *
	 * @param nodeData - the node data
	 * 
	 * @return - an SDF node iff the root node data can be converted to an SDF node, otherwise it returns SDF node data
	 * 	with the children converted to shader nodes where approriate.
	 */
	private static convertDataObjectToNodeRecursively(nodeData: SDFNodeData): SDFNodeData|SDFNode {
		for (let key in nodeData) {
			if (typeof nodeData[key] == 'object' && !(nodeData[key] instanceof Array)) {
				nodeData[key] = SDFNodeLoader.convertDataObjectToNodeRecursively(nodeData[key]);
			}
			else if (typeof nodeData[key] != 'string') {
				nodeData[key] = new ConstantNode(nodeData[key]);
			}
		}
		if (nodeData['type'] in NODE_TABLE) {
			return NODE_TABLE[nodeData['type']](nodeData);
		}
		else {
			return nodeData;
		}
	}

	/*
	 * Converts SDF node data to an SDF node
	 *
	 * @param nodeData - the data specifying type and additional parameters relating
	 * 			to the SDF node
	 *
	 * @return - the created SDF node
	 */
	public static fromDataObject(nodeData: SDFNodeData): SDFNode {
		var output = SDFNodeLoader.convertDataObjectToNodeRecursively(nodeData);
		if (output instanceof SDFNode) {
			return (<SDFNode>output);
		}
		else {
			throw 'Error: nodeData does not represent a node at root level.';
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
