precision highp float;

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

%%model_source%%

Distance scene_sdf(vec3 p) {
    %%scene_sdf_branching_code%%
    return Distance(-1, 0.0);
}

Intersection march(Ray r) {
    vec3 p = r.o;
    for (int i = 0; i < %%max_marching_steps%%; i++) {
        Distance d = scene_sdf(p);
        
        if (d.d < %%epsilon%%) {
            return Intersection(d.id, p);
        }
        
        p += r.d*d.d;
    }
    return Intersection(NO_OBJECT_FOUND, vec3(0));
}

void main() {
    gl_FragColor = vec4(sin(gl_FragCoord.x/100.0), 0, 0, 1);
}
