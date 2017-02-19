console.log('Revisioning build assets...');

const { generate } = require('randomstring'),
	{
		jsBuildName,
		cssBuildName,
		buildDirectory,
	} = require('../config'),
	{ renameSync, writeFileSync } = require('fs'),
	{ join } = require('path');

function getPath(file) {
	return `${buildDirectory}/${file}`;
}

const newSuffix = generate({ length: 12 }),
	jsReg = /^(.*)\.js$/,
	cssReg = /^(.*)\.css$/;

let newJsFile = jsBuildName.match(jsReg)[1],
	newCssFile = cssBuildName.match(cssReg)[1];

newJsFile = newJsFile + '-' + newSuffix + '.js';
newCssFile = newCssFile + '-' + newSuffix + '.css';

renameSync( getPath(jsBuildName), getPath(newJsFile) );
renameSync( getPath(cssBuildName), getPath(newCssFile) );

const outputFilepath = join(__dirname, '../manifest/manifest.json');

const filenameObject = {
	jsBuildFile: newJsFile,
	cssBuildFile: newCssFile,
};

writeFileSync(
	outputFilepath,
	JSON.stringify(filenameObject)
);

console.log('Finished revisioning assets.');