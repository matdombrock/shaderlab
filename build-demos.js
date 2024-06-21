const fs = require('fs');

// Standalone mode will use the CDN otherwise use a local file
// Standalone allows single HTML files to be deployed but these will not work offline
// Without standalone files must be distributed with the `src` dir
// The three.js code is too large to include in a single file
const STANDALONE = 1;

let threeLoc = '<script src="src/three.min.js"></script>';
if (STANDALONE) {
    threeLoc = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.159.0/three.min.js" integrity="sha512-OviGQIoFPxWNbGybQNprasilCxjtXNGCjnaZQvDeCT0lSPwJXd5TC3usI/jsWepKW9lZLZ1ob1q/Vy4MnlTt7g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>';
}

const shaderDir = __dirname + '/shaders/';
const demoDir = __dirname + '/webdemo/';
const srcDir = __dirname + '/src/'


fs.rmSync(demoDir, {recursive: true});
fs.mkdirSync(demoDir);

const listing = fs.readdirSync(shaderDir);
const template = fs.readFileSync(srcDir + 'template.html', 'utf-8');
const glsl = fs.readFileSync(srcDir + 'glsl.js', 'utf-8');
let linkHTML = '';
for (const item of listing) {
    const name = item.split('.')[0];
    linkHTML += `<a href="${name}.html" class="demo-link">${name}</a> `;
}
for (const item of listing) {
    const file = fs.readFileSync(shaderDir + item, 'utf-8');
    const name = item.split('.')[0];
    let temp = template;
    temp = temp.replace(/{{SHADER_CODE}}/g, file);
    temp = temp.replace(/{{LINK_CODE}}/g, linkHTML);
    temp = temp.replace(/{{GLSL_CODE}}/g, glsl);
    temp = temp.replace(/{{THREE_CODE}}/g, threeLoc);
    fs.writeFileSync(demoDir + name + '.html', temp);
    console.log('wrote '+name);
}
if (!STANDALONE) {
    fs.mkdirSync(demoDir + 'src');
    //fs.copyFileSync(srcDir + 'glsl.js', demoDir + 'src/glsl.js');
    fs.copyFileSync(srcDir + 'lib/three.min.js', demoDir + 'src/three.min.js');
}