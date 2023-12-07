const fs = require('fs');
const shaderDir = __dirname + '/shaders/';
const demoDir = __dirname + '/webdemo/';
const libDir = __dirname + '/lib/'

const listing = fs.readdirSync(shaderDir);
const template = fs.readFileSync(libDir + 'template.html', 'utf-8');
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
    fs.writeFileSync(demoDir + name + '.html', temp);
    console.log('wrote '+name);
}
fs.copyFileSync(libDir + 'glsl.js', demoDir + 'glsl.js');