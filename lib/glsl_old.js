let vscode = undefined;
    if (typeof acquireVsCodeApi === 'function') {
        vscode = acquireVsCodeApi();
    }
    var compileTimePanel;

    let revealError = function(line, file) {
        if (vscode) {
            vscode.postMessage({
                command: 'showGlslsError',
                line: line,
                file: file
            });
        }
    };

    let currentShader = {};
    // Error Callback
    console.error = function () {
        if('7' in arguments) {
            let errorRegex = /ERROR: \d+:(\d+):\W(.*)\n/g;
            let rawErrors = arguments[7];
            let match;
            
            let diagnostics = [];
            let message = '';
            while(match = errorRegex.exec(rawErrors)) {
                let lineNumber = Number(match[1]) - currentShader.LineOffset;
                let error = match[2];
                diagnostics.push({
                    line: lineNumber,
                    message: error
                });
                let lineHighlight = `<a class='error' unselectable onclick='revealError(${lineNumber}, "${currentShader.File}")'>Line ${lineNumber}</a>`;
                message += `<li>${lineHighlight}: ${error}</li>`;
            }
            console.log(message);
            let diagnosticBatch = {
                filename: currentShader.File,
                diagnostics: diagnostics
            };
            if (vscode !== undefined) {
                vscode.postMessage({
                    command: 'showGlslDiagnostic',
                    type: 'error',
                    diagnosticBatch: diagnosticBatch
                });
            }
    
            $('#message').append(`<h3>Shader failed to compile - ${currentShader.Name} </h3>`);
            $('#message').append('<ul>');
            $('#message').append(message);
            $('#message').append('</ul>');
        }
    };

    // Development feature: Output warnings from third-party libraries
    // console.warn = function (message) {
    //     $("#message").append(message + '<br>');
    // };

    let clock = new THREE.Clock();
    let pausedTime = 0.0;
    let deltaTime = 0.0;
    let startingTime = 0;
    let time = startingTime;

    let date = new THREE.Vector4();

    let updateDate = function() {
        let today = new Date();
        date.x = today.getFullYear();
        date.y = today.getMonth();
        date.z = today.getDate();
        date.w = today.getHours() * 60 * 60 
            + today.getMinutes() * 60
            + today.getSeconds()
            + today.getMilliseconds() * 0.001;
    };
    updateDate();

    let paused = false;
    let pauseButton = document.getElementById('pause-button');
    if (pauseButton) {
        pauseButton.onclick = function(){
            paused = pauseButton.checked;
            if (!paused) {
                // Audio Resume
                pausedTime += clock.getDelta();
            }
            else {
                // Audio Pause
            }
        };
    }
    
    {
        let screenshotButton = document.getElementById("screenshot");
        if (screenshotButton) {
            screenshotButton.addEventListener('click', saveScreenshot);
        }
    }
    
    {
        let reloadButton = document.getElementById("reload");
        if (reloadButton) {
            reloadButton.addEventListener('click', reloadWebview);
        }
    }
    
    window.addEventListener('message', event => {
        const message = event.data; // The JSON data our extension sent
        switch (message.command) {
            case 'pause':
                if (pauseButton) {
                    pauseButton.checked = !pauseButton.checked;
                }
                paused = !paused;
                if (!paused) {
                    // Audio Resume
                    pausedTime += clock.getDelta();
                }
                else {
                    // Audio Pause
                }
                break;
            case 'screenshot':
                saveScreenshot();
                break;
        }
    });

    let canvas = document.getElementById('canvas');
    let gl = canvas.getContext('webgl2');
    let isWebGL2 = gl != null;
    if (gl == null) gl = canvas.getContext('webgl');
    let supportsFloatFramebuffer = (gl.getExtension('EXT_color_buffer_float') != null) || (gl.getExtension('WEBGL_color_buffer_float') != null);
    let supportsHalfFloatFramebuffer = (gl.getExtension('EXT_color_buffer_half_float') != null);
    let framebufferType = THREE.UnsignedByteType;
    if (supportsFloatFramebuffer) framebufferType = THREE.FloatType;
    else if (supportsHalfFloatFramebuffer) framebufferType = THREE.HalfFloatType;

    let renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, context: gl, preserveDrawingBuffer: true });
    let resolution = new THREE.Vector3();
    let mouse = new THREE.Vector4(-1, -1, -1, -1);
    let mouseButton = new THREE.Vector4(0, 0, 0, 0);
    let normalizedMouse = new THREE.Vector2(0.011737089201877934, 0.8947368421052632);
    let frameCounter = 0;

    // Audio Init
    const audioContext = {
        sampleRate: 0
    };
    // Audio Resume

    let buffers = [];
    // Buffers
    buffers.push({
        //Name: '/home/mathieu/Lab/shaderlab/dull_day.frag',
        //File: '/home/mathieu/Lab/shaderlab/dull_day.frag',
        LineOffset: 133,
        Target: null,
        ChannelResolution: Array(10).fill(new THREE.Vector3(0,0,0)),
        PingPongTarget: null,
        PingPongChannel: 0,
        Dependents: [],
        Shader: new THREE.ShaderMaterial({
            fragmentShader: document.getElementById('shader').textContent,
            depthWrite: false,
            depthTest: false,
            uniforms: {
                iResolution: { type: 'v3', value: resolution },
                iTime: { type: 'f', value: 0.0 },
                iTimeDelta: { type: 'f', value: 0.0 },
                iFrame: { type: 'i', value: 0 },
                iMouse: { type: 'v4', value: mouse },
                iMouseButton: { type: 'v2', value: mouseButton },
    
                iChannelResolution: { type: 'v3v', value: Array(10).fill(new THREE.Vector3(0,0,0)) },
    
                iDate: { type: 'v4', value: date },
                iSampleRate: { type: 'f', value: audioContext.sampleRate },
    
                iChannel0: { type: 't' },
                iChannel1: { type: 't' },
                iChannel2: { type: 't' },
                iChannel3: { type: 't' },
                iChannel4: { type: 't' },
                iChannel5: { type: 't' },
                iChannel6: { type: 't' },
                iChannel7: { type: 't' },
                iChannel8: { type: 't' },
                iChannel9: { type: 't' },
    
                resolution: { type: 'v2', value: resolution },
                time: { type: 'f', value: 0.0 },
                mouse: { type: 'v2', value: normalizedMouse },
            }
        })
    });
    let commonIncludes = [];
    // Includes
    

    // WebGL2 inserts more lines into the shader
    if (isWebGL2) {
        for (let buffer of buffers) {
            buffer.LineOffset += 16;
        }
    }

    // Keyboard Init
    
    // Uniforms Init
    // Uniforms Update

    let texLoader = new THREE.TextureLoader();
    // Texture Init
    

    let scene = new THREE.Scene();
    let quad = new THREE.Mesh(
        new THREE.PlaneGeometry(resolution.x, resolution.y),
        null
    );
    scene.add(quad);
    
    let camera = new THREE.OrthographicCamera(-resolution.x / 2.0, resolution.x / 2.0, resolution.y / 2.0, -resolution.y / 2.0, 1, 1000);
    camera.position.set(0, 0, 10);

    // Run every shader once to check for compile errors
    let compileTimeStart = performance.now();
    let failed=0;
    for (let include of commonIncludes) {
        currentShader = {
            Name: include.Name,
            File: include.File,
            // add two for version and precision lines
            LineOffset: 26 + 2
        };
        // bail if there is an error found in the include script
        if(compileFragShader(gl, document.getElementById(include.Name).textContent) == false) {
            throw Error(`Failed to compile ${include.Name}`);
        }
    }

    for (let buffer of buffers) {
        currentShader = {
            Name: buffer.Name,
            File: buffer.File,
            LineOffset: buffer.LineOffset
        };
        quad.material = buffer.Shader;
        renderer.setRenderTarget(buffer.Target);
        renderer.render(scene, camera);
    }
    currentShader = {};
    let compileTimeEnd = performance.now();
    let compileTime = compileTimeEnd - compileTimeStart;
    if (compileTimePanel !== undefined) {
        for (let i = 0; i < 200; i++) {
            compileTimePanel.update(compileTime, 200);
        }
    }

    computeSize();
    render();

    function addLineNumbers( string ) {
        let lines = string.split( '\\n' );
        for ( let i = 0; i < lines.length; i ++ ) {
            lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];
        }
        return lines.join( '\\n' );
    }

    function compileFragShader(gl, fsSource) {
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fsSource);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            const fragmentLog = gl.getShaderInfoLog(fs);
            console.error( 'THREE.WebGLProgram: shader error: ', gl.getError(), 'gl.COMPILE_STATUS', null, null, null, null, fragmentLog );
            return false;
        }
        return true;
    }

    function render() {
        requestAnimationFrame(render);
        // Pause Whole Render
        if (paused) return;

        // Advance Time
        deltaTime = clock.getDelta();
        time = startingTime + clock.getElapsedTime() - pausedTime;
        updateDate();

        // Audio Update

        for (let buffer of buffers) {
            buffer.Shader.uniforms['iResolution'].value = resolution;
            buffer.Shader.uniforms['iTimeDelta'].value = deltaTime;
            buffer.Shader.uniforms['iTime'].value = time;
            buffer.Shader.uniforms['iFrame'].value = frameCounter;
            buffer.Shader.uniforms['iMouse'].value = mouse;
            buffer.Shader.uniforms['iMouseButton'].value = mouseButton;

            buffer.Shader.uniforms['resolution'].value = resolution;
            buffer.Shader.uniforms['time'].value = time;
            buffer.Shader.uniforms['mouse'].value = normalizedMouse;

            quad.material = buffer.Shader;
            renderer.setRenderTarget(buffer.Target);
            renderer.render(scene, camera);
        }
        
        // Uniforms Update

        // Keyboard Update

        for (let buffer of buffers) {
            if (buffer.PingPongTarget) {
                [buffer.PingPongTarget, buffer.Target] = [buffer.Target, buffer.PingPongTarget];
                buffer.Shader.uniforms[`iChannel${buffer.PingPongChannel}`].value = buffer.PingPongTarget.texture;
                for (let dependent of buffer.Dependents) {
                    const dependentBuffer = buffers[dependent.Index];
                    dependentBuffer.Shader.uniforms[`iChannel${dependent.Channel}`].value = buffer.Target.texture;
                }
            }
        }

        frameCounter++;
    }
    function computeSize() {
        let forceAspectRatio = (width, height) => {
            // Forced aspect ratio
            let forcedAspects = [0,0];
            let forcedAspectRatio = forcedAspects[0] / forcedAspects[1];
            let aspectRatio = width / height;

            if (forcedAspectRatio <= 0 || !isFinite(forcedAspectRatio)) {
                let resolution = new THREE.Vector3(width, height, 1.0);
                return resolution;
            }
            else if (aspectRatio < forcedAspectRatio) {
                let resolution = new THREE.Vector3(width, Math.floor(width / forcedAspectRatio), 1);
                return resolution;
            }
            else {
                let resolution = new THREE.Vector3(Math.floor(height * forcedAspectRatio), height, 1);
                return resolution;
            }
        };
        
        // Compute forced aspect ratio and align canvas
        resolution = forceAspectRatio(window.innerWidth, window.innerHeight);
        canvas.style.left = `${(window.innerWidth - resolution.x) / 2}px`;
        canvas.style.top = `${(window.innerHeight - resolution.y) / 2}px`;

        for (let buffer of buffers) {
            if (buffer.Target) {
                buffer.Target.setSize(resolution.x, resolution.y);
            }
            if (buffer.PingPongTarget) {
                buffer.PingPongTarget.setSize(resolution.x, resolution.y);
            }
        }
        renderer.setSize(resolution.x, resolution.y, false);
        
        // Update Camera and Mesh
        quad.geometry = new THREE.PlaneGeometry(resolution.x, resolution.y);
        camera.left = -resolution.x / 2.0;
        camera.right = resolution.x / 2.0;
        camera.top = resolution.y / 2.0;
        camera.bottom = -resolution.y / 2.0;
        camera.updateProjectionMatrix();

        // Reset iFrame on resize for shaders that rely on first-frame setups
        frameCounter = 0;
    }
    function saveScreenshot() {
        let doSaveScreenshot = () => {
            renderer.domElement.toBlob(function(blob){
                let a = document.createElement('a');
                let url = URL.createObjectURL(blob);
                a.href = url;
                a.download = 'shadertoy.png';
                a.click();
            }, 'image/png', 1.0);
        };

        let forcedScreenshotResolution = [0,0];
        if (forcedScreenshotResolution[0] <= 0 || forcedScreenshotResolution[1] <= 0) {
            renderer.render(scene, camera);
            doSaveScreenshot();
        }
        else {
            renderer.setSize(forcedScreenshotResolution[0], forcedScreenshotResolution[1], false);
            
            for (let buffer of buffers) {
                buffer.Shader.uniforms['iResolution'].value = new THREE.Vector3(forcedScreenshotResolution[0], forcedScreenshotResolution[1], 1);
                buffer.Shader.uniforms['resolution'].value = new THREE.Vector3(forcedScreenshotResolution[0], forcedScreenshotResolution[1], 1);

                quad.material = buffer.Shader;
                renderer.setRenderTarget(buffer.Target);
                renderer.render(scene, camera);
            }

            doSaveScreenshot();
            renderer.setSize(resolution.x, resolution.y, false);
        }
    }
    function reloadWebview() {
        if (vscode !== undefined) {
            vscode.postMessage({ command: 'reloadWebview' });
        }
    }
    function updateMouse() {
        if (vscode !== undefined) {
            vscode.postMessage({
                command: 'updateMouse',
                mouse: {
                    x: mouse.x,
                    y: mouse.y,
                    z: mouse.z,
                    w: mouse.w
                },
                normalizedMouse: {
                    x: normalizedMouse.x,
                    y: normalizedMouse.y
                }
            });
        }
    }
    let dragging = false;
    function updateNormalizedMouseCoordinates(clientX, clientY) {
        let rect = canvas.getBoundingClientRect();
        let mouseX = clientX - rect.left;
        let mouseY = resolution.y - clientY - rect.top;

        if (mouseButton.x + mouseButton.y != 0) {
            mouse.x = mouseX;
            mouse.y = mouseY;
        }

        normalizedMouse.x = mouseX / resolution.x;
        normalizedMouse.y = mouseY / resolution.y;
    }
    canvas.addEventListener('mousemove', function(evt) {
        updateNormalizedMouseCoordinates(evt.clientX, evt.clientY);
        updateMouse();
    }, false);
    canvas.addEventListener('mousedown', function(evt) {
        if (evt.button == 0)
            mouseButton.x = 1;
        if (evt.button == 2)
            mouseButton.y = 1;

        if (!dragging) {
            updateNormalizedMouseCoordinates(evt.clientX, evt.clientY);
            mouse.z = mouse.x;
            mouse.w = mouse.y;
            dragging = true
        }

        updateMouse();
    }, false);
    canvas.addEventListener('mouseup', function(evt) {
        if (evt.button == 0)
            mouseButton.x = 0;
        if (evt.button == 2)
            mouseButton.y = 0;

        dragging = false;
        mouse.z = -mouse.z;
        mouse.w = -mouse.w;

        updateMouse();
    }, false);
    window.addEventListener('resize', function() {
        computeSize();
    });

    // Keyboard Callbacks