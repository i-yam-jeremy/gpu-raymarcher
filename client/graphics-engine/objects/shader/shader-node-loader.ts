import {ShaderNode, ShaderNodeData} from "./shader-node";

import {Lambert} from "./basic/lambert";

type ShaderNodeCreator = (nodeData: ShaderNodeData) => ShaderNode;

const NODE_TABLE: { [nodeName: string] : ShaderNodeCreator } = {
	"lambert": Lambert.create
};

export class ShaderNodeLoader {

	public static fromDataObject(nodeData: ShaderNodeData): ShaderNode {
		if (nodeData['type'] in NODE_TABLE) {
			return NODE_TABLE[nodeData['type']](nodeData);
		}
	}

	public static fromJSON(jsonString: string): ShaderNode {
		try {
			var nodeData = JSON.parse(jsonString);
			return ShaderNodeLoader.fromDataObject(nodeData);
		} catch (e) {
			console.error(e);
		}
	}
}
