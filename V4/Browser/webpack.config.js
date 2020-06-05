const path = require( 'path' )
const CleanWebpackPlugin = require( 'clean-webpack-plugin' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const TerserPlugin = require( 'terser-webpack-plugin' )
const CopyWebpackPlugin = require( 'copy-webpack-plugin' )
const VueLoaderPlugin = require( 'vue-loader/lib/plugin' )
const { BundleAnalyzerPlugin } = require( 'webpack-bundle-analyzer' )
//const SentryWebpackPlugin = require( '@sentry/webpack-plugin' )
const webpack = require( 'webpack' )

const pkg = require( './package.json' )

/* Entry point of the app */
const entry = path.resolve( __dirname, 'src/js/main.js' )

/* Where webpack outputs the generated files */
const outputPath = path.resolve( __dirname, 'public/assets' )


const stats = {
	all: true,
	colors: true,
	children: false,
	maxModules: 0,
	chunks: false,
	chunkGroups: false,
	entrypoints: false,
	modules: false,
}

module.exports = ( env = {} ) => {
	const isProd = !!env.production
	const isAnalyze = !!env.analyze

	const useSourcemaps = function useSourcemaps () {
		/*
		 * If you are using Sentry, consider using hidden source maps
		 * and removing before production:
		 *
		 * `return isProd ? 'hidden-source-map': 'eval-source-map'`
		 */
		return isProd ? 'none' : 'eval-source-map'
	}

	/*
	 * Should we emit sourcemaps when minimizing?
	 * Make sure you remove before production if you do
	 */
	const outputSourcemaps = function outputSourcemaps () {
		return isProd
	}

	const statTypes = function statTypes () {
		/*
		 * More verbose stats to see errors and debug production builds
		 * more easily
		 */
		return isProd ? 'normal' : stats
	}

	/*
	 * If app is stored in a sub folder in production, make sure to
	 * adjust this as appropriate for production
	 *
	 * ex: app is served from within the `/baz` folder
	 * url: https://foobar.com/baz/
	 * `return isProd ? '/baz/assets/' : '/assets/'`
	 */
	const publicPath = function publicPath () {
		return '/assets/'
	}

	/* how should the entry file be called in production */
	const outputFilename = function outputFilename () {
		return isProd ? 'js/app.[contenthash].js' : 'js/app.js'
	}

	const config = {
		stats: statTypes(),
		entry,
		output: {
			filename: outputFilename,
			path: outputPath,
			publicPath: publicPath(),
		},
		resolve: {
			extensions: [ '.js', '.vue' ],
			/* Avoid importing with relative paths */
			alias: {
				'@': path.resolve( __dirname, 'src/js' ),
				Components: path.resolve( __dirname, 'src/js/components/' ),
				Helpers: path.resolve( __dirname, 'src/js/helpers/' ),
				Mixins: path.resolve( __dirname, 'src/js/mixins/' ),
				Models: path.resolve( __dirname, 'src/js/models/' ),
				Plugins: path.resolve( __dirname, 'src/js/plugins/' ),
				Views: path.resolve( __dirname, 'src/js/views/' ),
				Styles: path.resolve( __dirname, 'src/js/assets/scss/' ),
				Transitions: path.resolve( __dirname, 'src/js/components/Transitions' ),
				SassVariables: path.resolve( __dirname, 'src/js/assets/scss/_variables.scss' ),
				SassMixins: path.resolve( __dirname, 'src/js/assets/scss/_mixins.scss' ),
				SassMedia: path.resolve( __dirname, 'src/js/assets/scss/_media.scss' ),
				Assets: path.resolve( __dirname, 'src/js/assets' ),
				/* Use esm so we can have treeshaking */
				vue$: 'vue/dist/vue.esm.js',
			},
		},
		devtool: useSourcemaps(),
		plugins: [
			/* Make somethings globally available inside the app */
			new webpack.DefinePlugin( {
				'process.env': {
					VERSION: JSON.stringify( pkg.version ),
					ENVIRONMENT: JSON.stringify( env.ENVIRONMENT ),
				},
			} ),
			/* Remove the 'public' folder on each build to avoid pollution between builds */
			new CleanWebpackPlugin( [ 'public' ], { verbose: true } ),
			new MiniCssExtractPlugin( { filename: 'css/[name].[contenthash].css' } ),
			/*
			 * Automatically import files into index.html
			 * Can use underscore templates in this file
			 */
			new HtmlWebpackPlugin( {
				template: 'src/html/index.html',
				filename: '../index.html',
				inject: 'head',
			} ),
			/* Copy assets during build (fonts, static images, etc) */
			new CopyWebpackPlugin( [] ),
			new VueLoaderPlugin(),
		],
		module: {
			rules: [
				{
					test: /\.worker\.js$/,
					use: {
						loader: 'worker-loader',
					},
				},
				{
					test: /\.(le|c)ss$/,
					use: [
						{ loader: isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader' },
						{
							loader: 'css-loader',
							options: { importLoaders: 1 },
						},
						{ loader: 'postcss-loader' },
						{ loader: 'less-loader' },
					],
				},
				{
					test: /\.(sc|sa)ss$/,
					use: [
						{ loader: isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader' },
						{
							loader: 'css-loader',
							options: { importLoaders: 1 },
						},
						{ loader: 'postcss-loader' },
						{ loader: 'resolve-url-loader' },
						{
							loader: 'sass-loader',
							options: {
								implementation: require( 'sass' ),
								sourceMap: true,
								sourceMapContents: false,
							},
						},
					],
				},
				{
					test: /\.js$/,
					loader: 'babel-loader',
					exclude: file => (
						( /node_modules/ ).test( file ) &&
						!( /\.vue\.js/ ).test( file )
					),
				},
				{
					test: /\.vue$/,
					loader: 'vue-loader',
				},
				{
					test: /\.(png|jpg|gif)$/,
					use: [
						{
							loader: 'url-loader',
							options: {
								fallback: 'file-loader',
								limit: 8192,
								name: '[name].[ext]',
								/* appended to webpack outputPath */
								outputPath: 'images',
							},
						},
					],
				},
				{
					test: /\.svg$/,
					exclude: /fonts/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								/* appended to webpack outputPath */
								outputPath: 'images',
							},
						},
					],
				},
				{
					test: /fonts\/.*\.(woff|woff2|eot|ttf|otf|svg)$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								/* appended to webpack outputPath */
								outputPath: 'fonts',
							},
						},
					],
				},
			],
		},

		optimization: {
			minimize: isProd,
			minimizer: [
				new TerserPlugin( {
					/* Should we output source maps? */
					sourceMap: outputSourcemaps(),
					exclude: /\.min\.js/,
					parallel: 2,
					cache: true,
					terserOptions: {
						compress: {
							/* Don't console in production */
							drop_console: true, //eslint-disable-line camelcase
						},
					},
				} ),
			],
			runtimeChucnk: 'single',
			splitChunks: {
				cacheGroups: {
					/* Extract node_modules to its own chunk */
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
					},
				},
			},
		},
	}

	if ( isAnalyze ) {
		config.plugins.push( new BundleAnalyzerPlugin() )
	}

	if ( isProd ) {
		/* This gives better content hashing and caching of chunks */
		config.plugins.push( new webpack.HashedModuleIdsPlugin() )

		/*
		 * If you are using sentry you need to uncomment
		 * the following section and pay attention to the needed
		 * fields.
		 */
		//config.plugins.push( new SentryWebpackPlugin( {
		//	include: './public',
		//	/* Must be uniq to our org (ex: project-slug@version) */
		//	release: '',
		//	ignoreFile: '.gitignore',
		//	/*
		//	 * Similar to public path
		//	 * ex: served from https://foobar.com/baz
		//	 * `urlPrefix: '~baz/'`
		//	 */
		//	urlPrefix: '',
		//	ignore: [ 'node_modules', 'webpack.config.js' ],
		//	/* Make this file but DO NOT COMMIT */
		//	configFile: '.sentryclirc',
		//	debug: false,
		//	dryRun: false,
		//} ) )
	}

	return config
}
