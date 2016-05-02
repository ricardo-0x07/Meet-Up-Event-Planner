# Project Overview


# Installation

1. Fork the repository, download it and open the index.html the dist folder in a browser.
2. Or run the "gulp" command from the root directory in the command line as described below on running the build process step 1.

## Usage
1. After the application has been loaded successfully, ........


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

1.

## Credits

1. 

## License



# How to set up the build process

1. Install gulp globally: sudo npm install --global gulp-cli
2. Install gulp in project folder: sudo npm install --save-dev gulp
3. Install gulp-sass in project folder: sudo npm install gulp-sass --save-dev
4. Install autoprefixer: sudo npm install gulp-autoprefixer --save-dev 
5. Install browser sync globally: sudo npm install -g browser-sync
6. Install browser sync in project folder: sudo npm install browser-sync gulp --save-dev
7. Install eslint: sudo npm install -g eslint
8. Install sublimelinter-contrib-eslint via package control
9. Initialize eslint: eslint --init
10. Install gulp-eslint: sudo npm install gulp-eslint
11. Install eslint-config-google: sudo npm install --save eslint-config-google
12. Install gulp-jasmine: sudo npm install gulp-jasmine
13. Install gulp-concat: sudo npm install gulp-concat
14. Install gulp-uglify: sudo npm install gulp-uglify
15. Install gulp-sourcemaps: sudo npm install gulp-sourcemaps
16. Install gulp-imagemin: sudo npm install --save-dev gulp-imagemin
17. Install imagemin-pngquant: sudo npm install --save imagemin-pngquant
18. Install gulp-gh-pages to deploy to gh-pages with "gulp deploy" or "gulp dist" command: sudo npm install --save-dev gulp-gh-pages

# Running the Build Process

1. Once the build process has been set up as described above navigate to the root directory of the project and type "gulp" and press enter to run the default task this will open the application in the browser.
2. To process source files for distribution and deploy run the following form root directory on the command line: "gulp dist" this will deploy any updates to the project gh-pages.
3. While the application is running via the build process several gulp tasks will be watching for changes and errors in the css, js, html and spec files and update the distribution files automatically. The browser will be refreshed for changes to the index.html.


npm install backbone-localstorage
