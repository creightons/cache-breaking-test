## Synopsis
A practice project to implement cache-breaking static frontend files.

Gulp is used to create the js and css build files and a js script takes the files and attaches a unique string to their filenames. The new filenames are stored in a json file which is read by an expressjs server when run in production mode. The filenames are inserted into a pug template and the rendered html page requests the appropriate build files which are then cached for a year in the browser. To update the build files, run the gulp/js scripts again and restart the server. The next time a user requests the page, the new assets will be requested and cached.

To run:
- Clone the source with `git clone`
- Install dependencies `npm install`
- Check config.js and make sure that `NODE_ENVIRONMENT` and 'production'
- Generate the build assets with `npm run build`
- Start the server `npm start`
- Go to localhost:3000 and open the Network tab in the developer tools
- Refresh the page and the build files should be cached
- Build the assets again `npm run build`
- Restart the server `Ctrl+C` `npm start`
- Refresh the page and new assets should be downloaded
- Refresh again and the files should be cached

If you run the server in development, the files will not be cached.
