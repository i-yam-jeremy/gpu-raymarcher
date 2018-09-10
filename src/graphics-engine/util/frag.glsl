#version 300 es
precision highp float;

layout(location = 0) out vec4 main_image_color;
layout(location = 1) out vec4 depth_output;

/*
 * Terms Used In This File
 *
 * Model (model base) - the basic model SDF with no transformation applied
 * Object - an instance of a model with transformations applied
 * 	(there can be multiple objects that are instances of the same model)
 *
 */


/*
 * The time in seconds
 * (the offset of this time is not important because
 *  it is used for animations which only need to use the
 *  time modulo the animation time)
 */
uniform float u_time;
/* the position of the camera */
uniform vec3 u_camera_pos;
/* the screen width and height */
uniform vec2 u_resolution;
/* the object data texture */
uniform sampler2D u_object_data;
/* object data texture side length in pixels */
uniform int u_object_data_side_length;
/* the number of objects in the scene */
uniform int u_object_count;
/* the depth texture width and height */
uniform vec2 u_depth_texture_resolution;
/* the depth from the previous frame */
uniform sampler2D u_depth_texture;


/* 
 * used for when the max number of raymarching steps is reached
 * before hitting an object
 */
#define NO_OBJECT_FOUND (-1)

/*
 * Identifying IDs for objects
 */
struct ObjectID {
	int modelId;  // the id of the model this object is an instance of
	int objectId; // the unique identifier for this object
};

/*
 * A 3D Ray
 */
struct Ray {
	vec3 o; // origin
	vec3 d; // direction
};

/*
 * Distance to a given object
 */
struct Distance {
	ObjectID id; // object id
	float d; // distance
};

/*
 * Intersection between ray and the surface of an object
 */
struct Intersection {
	ObjectID id; // object id
	vec3 p; // intersection point
};

/*
 * Returns the Distance struct with the smaller (more-negative, not magnitude) distance
 *
 * @param a - the first Distance
 * @param b - the second Distance
 *
 * @return - the smaller of a and b
 */
Distance min_d(Distance a, Distance b) {
	if (a.d < b.d) {
		return a;
	}
	else {
		return b;
	}
}

%%model_source%%

/*
 * Returns the distance to the given model base from the given point
 * (By model base I mean the model without any instance-specific transformations
 *  applied. All transformations are applied to p before this function is called)
 *
 * @param id - the model id
 * @param p - the point
 *
 * @return - the shortest distance to the surface of specified model base
 */
float scene_sdf(int modelId, vec3 p) {
	%%scene_sdf_branching_code%%
	return -1.0; // Invalid modelId
}

/*
 * Calculates the normal of the model base at the given point
 * (By model base I mean the model without any instance-specific transformations
 *  applied. All transformations are applied to p before this function is called)
 *
 * @param id - the model id
 * @param p - the point
 *
 * @return - the normal
 */
vec3 calc_normal(int modelId, vec3 p) {
	float h = 0.001;
	float d = scene_sdf(modelId, p);
	return normalize(vec3(
			(d - scene_sdf(modelId, p+vec3(h, 0, 0))) / h,
			(d - scene_sdf(modelId, p+vec3(0, h, 0))) / h,
			(d - scene_sdf(modelId, p+vec3(0, 0, h))) / h
		));
}

int imod(int n, int m) {
	return n - m*(n/m);
}

/*
 * Raymarches along the given ray, starting at the rays origin until it
 * intersects with an object or it reaches the max number of raymarching steps
 *
 * @param r - the ray to march along
 *
 * @return - the intersection between the ray and the hit object's surface
 * 	(intersection has objectId NO_OBJECT_FOUND when the no object was hit
 * 	 before reaching the max number of marching steps)
 */
Intersection march(Ray r) {
	vec3 p = r.o;
	for (int i = 0; i < %%max_marching_steps%%; i++) {
		Distance d = Distance(ObjectID(-1, -1), 10e20);
		for (int obj = 0; obj < 100000; obj++) {
			if (!(obj < u_object_count)) {
				break;
			}
			vec4 data = texture(u_object_data, vec2(imod(obj/4, u_object_data_side_length), obj/4 / u_object_data_side_length) / float(u_object_data_side_length));
			float value;
			int channel = imod(obj, 4);
			vec4 tmp = data.rgba * vec4(channel == 0, channel == 1, channel == 2, channel == 3);
			value = tmp.r + tmp.g + tmp.b + tmp.a;
			/*if (channel == 0)
				value = data.r;
			else if (channel == 1)
				value = data.g;
			else if (channel == 2)
				value = data.b;
			else if (channel == 3)
				value = data.a;*/
			int modelId = int(value*float(%%model_count%%));
			d = min_d(d, Distance(ObjectID(modelId, obj), scene_sdf(modelId, p)));
		}
		
		if (d.d < %%epsilon%%) {
			return Intersection(d.id, p);
		}
		
		p += r.d*d.d;
		if (length(p - r.o) > float(%%max_render_distance%%)) {
			break;
		}
	}
	return Intersection(ObjectID(-1, NO_OBJECT_FOUND), vec3(0));
}

/*
 * Calculates the shading of the specified object for a specified light. Calls the shader
 * function of the model base
 * (By model base I mean the model without any instance-specific transformations
 *  applied. All transformations are applied to p before this function is called)
 *
 *  @param modelId - the model id
 *  @param p - the point on the surface of the model
 *  @param normal - the normal vector of the model surface at the given point p
 *  @param light_dir - the light
 *
 *  @return - the color of the shading of the model at the given point
 */
vec3 shade(int modelId, vec3 p, vec3 normal, vec3 light_dir) {
	%%model_shader_branching_code%%
	return vec3(1, 0, 1); // Invalid id specified 
}

/*
 * The shader main function. Raymarches, finds the intersection point, and shades the object
 */
void main() {
	vec3 camera_pos = u_camera_pos + vec3(0, 0, -3.0);
	vec2 uv = (2.0*gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
	
	Ray r = Ray(camera_pos, normalize(vec3(uv, 0) - camera_pos));
	float previous_depth = texture(u_depth_texture, gl_FragCoord.xy/u_depth_texture_resolution).r*float(%%max_render_distance%%);
	r.o += r.d * previous_depth;
	Intersection i = march(r);
	depth_output = vec4(vec3(length(i.p - camera_pos) / float(%%max_render_distance%%)), 1);
	if (i.id.objectId == NO_OBJECT_FOUND) {
		main_image_color = vec4(0, 0, 0, 1);
	}
	else {
		vec3 light_pos = vec3(0, 0, -2);
		vec3 light_dir = normalize(light_pos - i.p);
		vec3 normal = calc_normal(i.id.modelId, i.p);
		vec3 c = shade(i.id.modelId, i.p, normal, light_dir);
		main_image_color = vec4(c, 1);
	}
	//main_image_color = vec4(texture(u_depth_texture, gl_FragCoord.xy/u_depth_texture_resolution).rgb, 1);
	//main_image_color = vec4(texture(u_object_data, uv).rgb, 1);
	//main_image_color = vec4(vec3(float(i.id.modelId+1)/2.0), 1);
}
