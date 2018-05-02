precision highp float;

uniform float u_time;
uniform vec3 u_camera_pos;

#define NO_OBJECT_FOUND (-1)

struct Ray {
	vec3 o; // origin
	vec3 d; // direction
};

struct Distance {
	int id; // object id
	float d; // distance
};

struct Intersection {
	int id; // object id
	vec3 p; // intersection point
};

Distance min_d(Distance a, Distance b) {
	if (a.d < b.d) {
		return a;
	}
	else {
		return b;
	}
}

%%model_source%%

Distance scene_sdf(int id, vec3 p) {
	%%scene_sdf_branching_code%%
	return Distance(0, length(p - vec3(sin(10.0*u_time), 0.5, 10)) - 0.3);
	return Distance(-1, 0.0);
}

vec3 calc_normal(int id, vec3 p) {
	float h = 0.001;
	float d = scene_sdf(id, p).d;
	return normalize(vec3(
			(d - scene_sdf(id, p+vec3(h, 0, 0)).d) / h,
			(d - scene_sdf(id, p+vec3(0, h, 0)).d) / h,
			(d - scene_sdf(id, p+vec3(0, 0, h)).d) / h
		));
}

Intersection march(Ray r) {
	vec3 p = r.o;
	for (int i = 0; i < %%max_marching_steps%%; i++) {
		Distance d = Distance(-1, 10e20);
		for (int id = 0; id < 1; id++) {
			d = min_d(d, scene_sdf(id, p));
		}
		
		if (d.d < %%epsilon%%) {
			return Intersection(d.id, p);
		}
		
		p += r.d*d.d;
	}
	return Intersection(NO_OBJECT_FOUND, vec3(0));
}

void main() {
	vec3 camera_pos = vec3(0, 0, -3.0);
	vec2 uv = gl_FragCoord.xy / 800.0;
	Ray r = Ray(camera_pos, normalize(vec3(uv, 0) - camera_pos));
	Intersection i = march(r);
	if (i.id == NO_OBJECT_FOUND) {
		gl_FragColor = vec4(0, 0, 0, 1);
	}
	else {
		vec3 light_pos = camera_pos;
		vec3 L = normalize(i.p - light_pos);
		float c = dot(L, calc_normal(i.id, i.p));
		gl_FragColor = vec4(c*vec3(0, 1, 0), 1);
	}
}
