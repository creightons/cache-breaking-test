const express = require('express'),
	morgan = require('morgan'),
	{ existsSync } = require('fs'),
	app = express(),
	{
		jsBuildName,
		cssBuildName,
	} = require('./config.js');

// Set view/templates
app.set('view engine', 'pug')
app.set('views', 'views');

// Set logging
app.use(morgan('dev'));

// Set static directory
app.use(express.static("public"));

process.env.NODE_ENVIRONMENT = 'production';

let renderArgs;
debugger;
if (process.env.NODE_ENVIRONMENT === 'production') {
	if (!existsSync('manifest/manifest.json')) {
		throw new Error('Need to build frontend assets before deploying production server.');
	}
	
	const manifest = require('./manifest/manifest.json');
	
	renderArgs = {
		jsScript: manifest.jsBuildFile,
		cssScript: manifest.cssBuildFile,
	};
}
else {
	renderArgs = { jsScript: jsBuildName, cssScript: cssBuildName };
}

// Render page
app.get('/', (req, res, next) => res.status(200).render('index', renderArgs));

// Start server
const port = 3000;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`);
});