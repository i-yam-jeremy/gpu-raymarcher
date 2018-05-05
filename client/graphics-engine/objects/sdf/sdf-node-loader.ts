import {SDFNode, SDFNodeData} from "./sdf-node";

import {Sphere} from "./primitives/sphere";

type SDFNodeCreator = (nodeData: SDFNodeData) => SDFNode;

const NODE_TABLE: { [nodeName: string] : SDFNodeCreator } = {
	"sphere": Sphere.create
};

export class SDFNodeLoader {

	public static fromDataObject(nodeData: SDFNodeData): SDFNode {
		if (nodeData['type'] in NODE_TABLE) {
			return NODE_TABLE[nodeData['type']](nodeData);
		}
	}

	public static fromJSON(jsonString: string): SDFNode {
		try {
			var nodeData = JSON.parse(jsonString);
			return SDFNodeLoader.fromDataObject(nodeData);
		} catch (e) {
			console.error(e);
		}
	}
}
