const express = require('express'),
	morgan = require('morgan'),
	{ existsSync } = require('fs'),
	app = express(),
	{
		jsBuildName,
		cssBuildName,
		NODE_ENVIRONMENT
	} = require('./config.js');

// Set view/templates
app.set('view engine', 'pug')
app.set('views', 'views');

// Set logging
app.use(morgan('dev'));


const ONE_YEAR = 365 * 24 * 60 * 60 * 1000; // 1 Year in milliseconds

process.env.NODE_ENVIRONMENT = NODE_ENVIRONMENT;

// Handle Cache Breaking
let renderArgs,
	staticOptions = {};

if (process.env.NODE_ENVIRONMENT === 'production') {
	if (!existsSync('manifest/manifest.json')) {
		throw new Error('Need to build frontend assets before deploying production server.');
	}
	
	const manifest = require('./manifest/manifest.json');
	
	// If in production, supply the index page with revisioned asset files
	renderArgs = {
		jsScript: manifest.jsBuildFile,
		cssScript: manifest.cssBuildFile,
	};
	
	// Cache production assets for one year. They will only be replaced when
	// new revision reversions are made
	staticOptions.maxage = ONE_YEAR;
}
else {
	// If in development, use simple asset files
	renderArgs = { jsScript: jsBuildName, cssScript: cssBuildName };
	// Don't cache files in development.
	staticOptions.maxage = 0;
}

// Set static directory
app.use(express.static("public", staticOptions));

// Render page
app.get('/', (req, res, next) => res.status(200).render('index', renderArgs));

// Start server
const port = 3000;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`);
});