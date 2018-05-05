import {ShaderNode, ShaderNodeData} from "./shader-node";

import {Lambert} from "./basic/lambert";

/* a function that creates a ShaderNode from given ShaderNodeData */
type ShaderNodeCreator = (nodeData: ShaderNodeData) => ShaderNode;

/* the table mapping node names to their respective creator function */
const NODE_TABLE: { [nodeName: string] : ShaderNodeCreator } = {
	"lambert": Lambert.create
};

/*
 * Loads shader node objects from JSON and node data
 */
export class ShaderNodeLoader {

	/*
	 * Converts shader node data to a shader node
	 *
	 * @param nodeData - the data specifying type and addition paremeters relating
	 * 			to the shader node
	 *
	 * @return - the created shader node
	 */
	public static fromDataObject(nodeData: ShaderNodeData): ShaderNode {
		if (nodeData['type'] in NODE_TABLE) {
			return NODE_TABLE[nodeData['type']](nodeData);
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
