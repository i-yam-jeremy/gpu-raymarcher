import {GLSLFunctionSet, GLSLFunction} from "../../util/glsl";

export type SDFNodeData = { [key: string] : any };

export abstract class SDFNode {

	//public static abstract create(nodeData: SDFNodeData): SDFNode;
	public abstract compile(): GLSLFunctionSet;

}
