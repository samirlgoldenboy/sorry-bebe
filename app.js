var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize the GL context
var gl = canvas.getContext('webgl');
if (!gl) {
    console.error("Unable to initialize WebGL.");
}

// Time
var time = 0.0;

// Shader sources (same as before, but including necessary code)
// This is the fragment shader and vertex shader code you already have

// Add your fragment and vertex shader code here from the previous example
// Also make sure your getHeartPosition, sdBezier, and other functions are kept intact as you had them

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(widthHandle, window.innerWidth);
    gl.uniform1f(heightHandle, window.innerHeight);
}

// Compile shader and combine with source (same as before)
function compileShader(shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
    }
    return shader;
}

// Get attribute/uniform location (same as before)
function getAttribLocation(program, name) {
    var attributeLocation = gl.getAttribLocation(program, name);
    if (attributeLocation === -1) {
        throw 'Cannot find attribute ' + name + '.';
    }
    return attributeLocation;
}

function getUniformLocation(program, name) {
    var attributeLocation = gl.getUniformLocation(program, name);
    if (attributeLocation === -1) {
        throw 'Cannot find uniform ' + name + '.';
    }
    return attributeLocation;
}

// Create shaders (same as before)
var vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
var fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

// Create shader programs (same as before)
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Set up rectangle covering entire canvas
var vertexData = new Float32Array([
    -1.0, 1.0,     // top left
    -1.0, -1.0,     // bottom left
    1.0, 1.0,     // top right
    1.0, -1.0,     // bottom right
]);

// Create vertex buffer (same as before)
var vertexDataBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

// Layout of our data in the vertex buffer (same as before)
var positionHandle = getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionHandle);
gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 2 * 4, 0);

// Set uniform handle (same as before)
var timeHandle = getUniformLocation(program, 'time');
var widthHandle = getUniformLocation(program, 'width');
var heightHandle = getUniformLocation(program, 'height');

gl.uniform1f(widthHandle, window.innerWidth);
gl.uniform1f(heightHandle, window.innerHeight);

var lastFrame = Date.now();
var thisFrame;

function draw() {
    // Update time
    thisFrame = Date.now();
    time += (thisFrame - lastFrame) / 1000;
    lastFrame = thisFrame;

    // Send uniforms to program
    gl.uniform1f(timeHandle, time);
    // Draw a triangle strip connecting vertices 0-4
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(draw);
}

draw();
