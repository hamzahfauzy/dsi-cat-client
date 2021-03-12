let mix = require('laravel-mix');

/*
|--------------------------------------------------------------------------
| Mix Asset Management
|--------------------------------------------------------------------------
|
| Mix provides a clean, fluent API for defining some Webpack build steps
| for your Laravel application. By default, we are compiling the Sass
| file for your application, as well as bundling up your JS files.
|
*/

mix.js('src/scripts/app.js', 'public/dist/scripts')
.sass('src/styles/app.scss', 'public/dist/styles');

mix.copyDirectory('src/images', 'public/dist/images');
mix.copyDirectory('src/fonts/font-awesome/fonts', 'public/dist/fonts');

mix.options({
    processCssUrls: false,
});