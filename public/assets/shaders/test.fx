precision mediump float;

varying vec2 outTexCoord;
uniform sampler2D uTexture;
uniform float testing;
uniform float cooldown_time;

float angleBetweenPoints(vec2 v1, vec2 v2) {
    
}

void main() {
    vec4 color = texture2D(uTexture, vec2(outTexCoord.x, 1.0 - outTexCoord.y));
    vec4 cooldown_color = vec4(color.r*0.5, color.g*0.5, color.b*0.9, color.a);
    float angle = angleBetweenPoints(vec2(0.0,1.0), vec2(outTexCoord.x, 1.0 - outTexCoord.y));
    if(angle < cooldown_time){
        gl_FragColor = cooldown_color;
    }
    else{
        gl_FragColor = color;
    }
}