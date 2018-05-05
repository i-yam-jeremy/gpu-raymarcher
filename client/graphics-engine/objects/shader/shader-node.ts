import {GLSLFunctionSet, GLSLFunction} from "../../util/glsl";

export type ShaderNodeData = { [key: string] : any };

export abstract class ShaderNode {

	//public static abstract create(nodeData: ShaderNodeData): ShaderNode;
	public abstract compile(): GLSLFunctionSet;

}
