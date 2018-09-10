import {ShaderNode, ShaderNodeData} from "./shader-node";

import {ConstantNode} from "./basic/constant";
import {Lambert} from "./basic/lambert";
import {Phong} from "./basic/phong";
import {SpecialInput} from "./basic/special-input";
import {Custom} from "./basic/custom";

/* a function that creates a ShaderNode from given ShaderNodeData */
type ShaderNodeCreator = (nodeData: ShaderNodeData) => ShaderNode;

/* the table mapping node names to their respective creator function */
const NODE_TABLE: { [nodeName: string] : ShaderNodeCreator } = {
	"lambert": Lambert.create,
	"phong": Phong.create,
	"special-input": SpecialInput.create,
	"custom": Custom.create
};

/*
 * Loads shader node objects from JSON and node data
 */
export class ShaderNodeLoader {

	/*
	 * Converts this node data dictionary to shader nodes where applicable.
	 * It does this recursively on all fields on the node data dictionary, starting from leafs and building up from there.
	 *
	 * @param nodeData - the node data
	 * 
	 * @return - a shader node iff the root node data can be converted to a shader node, otherwise it returns shader node data
	 * 	with the children converted to shader nodes where approriate.
	 */
	private static convertDataObjectToNodeRecursively(nodeData: ShaderNodeData): ShaderNodeData|ShaderNode {
		for (let key in nodeData) {
			if (typeof nodeData[key] == 'object' && !(nodeData[key] instanceof Array)) {
				nodeData[key] = ShaderNodeLoader.convertDataObjectToNodeRecursively(nodeData[key]);
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
	 * Converts shader node data to a shader node
	 *
	 * @param nodeData - the data specifying type and addition paremeters relating
	 * 			to the shader node
	 *
	 * @return - the created shader node
	 */
	public static fromDataObject(nodeData: ShaderNodeData): ShaderNode {
		var output = ShaderNodeLoader.convertDataObjectToNodeRecursively(nodeData);
		if (output instanceof ShaderNode) {
			return (<ShaderNode>output);
		}
		else {
			throw 'Error: nodeData does not represent a node at root level.';
		}
	}

	/*
	 * Converts a JSON string to a shader node
	 *
	 * @param jsonString - the JSON string containing the node data
	 *
	 * @return - the created shader node
	 */
	public static fromJSON(jsonString: string): ShaderNode {
		try {
			var nodeData = JSON.parse(jsonString);
			return ShaderNodeLoader.fromDataObject(nodeData);
		} catch (e) {
			console.error(e);
		}
	}
}
