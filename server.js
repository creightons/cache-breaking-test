const express = require('express'),
	morgan = require('morgan');
	app = express();

// Set view/templates
app.set('view engine', 'pug')
app.set('views', 'views');

// Set logging
app.use(morgan('dev'));

// Set static directory
app.use(express.static("public"));

// Render page
app.get('/', (req, res, next) => res.status(200).render('index'));

// Start server
const port = 3000;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`);
});