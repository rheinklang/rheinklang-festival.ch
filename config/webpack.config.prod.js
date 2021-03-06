'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
	throw new Error('Production builds must have NODE_ENV=production.');
}

const cssFilename = 'static/css/[name].[contenthash:8].css';

const extractTextPluginOptions = shouldUseRelativeAssetPaths
	? { publicPath: Array(cssFilename.split('/').length).join('../') }
	: {};

module.exports = {
	bail: true,
	devtool: shouldUseSourceMap ? 'source-map' : false,
	entry: [require.resolve('./polyfills'), paths.appIndexJs],
	output: {
		path: paths.appBuild,
		filename: 'static/js/[name].[chunkhash:8].js',
		chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
		publicPath: publicPath,
		devtoolModuleFilenameTemplate: info =>
			path
				.relative(paths.appSrc, info.absoluteResourcePath)
				.replace(/\\/g, '/'),
	},
	resolve: {
		modules: ['node_modules', paths.appNodeModules].concat(
			process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
		),
		extensions: [
			'.mjs',
			'.web.ts',
			'.ts',
			'.web.tsx',
			'.tsx',
			'.web.js',
			'.js',
			'.json',
			'.web.jsx',
			'.jsx',
		],
		alias: {
			'react-native': 'react-native-web',
		},
		plugins: [
			new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
			new TsconfigPathsPlugin({ configFile: paths.appTsProdConfig }),
		],
	},
	module: {
		strictExportPresence: true,
		rules: [
			{
				test: /\.(js|jsx|mjs)$/,
				loader: require.resolve('source-map-loader'),
				enforce: 'pre',
				include: paths.appSrc,
			},
			{
				oneOf: [
					{
						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
						loader: require.resolve('url-loader'),
						options: {
							limit: 10000,
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
					{
						test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
						include: [
							path.resolve(__dirname, '../src/assets/fonts'),
							path.resolve(__dirname, '../src/components/atoms/Icon/css/fonts'),
						],
						use: [{
							loader: 'file-loader',
							options: {
								name: 'static/media/fonts/[name].[hash].[ext]'
							}
						}]
					},
					{
						test: /\.svg$/,
						exclude: [
							path.resolve(__dirname, '../src/assets/fonts')
						],
						loader: 'svg-inline-loader?classPrefix'
					},
					{
						test: /\.(js|jsx|mjs)$/,
						include: paths.appSrc,
						loader: require.resolve('babel-loader'),
						options: {

							compact: true,
						},
					},
					// Compile .tsx?
					{
						test: /\.(ts|tsx)$/,
						include: paths.appSrc,
						use: [
							{
								loader: require.resolve('ts-loader'),
								options: {
									// disable type checker - we will use it in fork plugin
									transpileOnly: true,
									configFile: paths.appTsProdConfig,
								},
							},
						],
					},
					{
						test: /\.(sa|sc|c)ss$/,
						loader: ExtractTextPlugin.extract(
							Object.assign(
								{
									fallback: {
										loader: require.resolve('style-loader'),
										options: {
											hmr: false,
										},
									},
									use: [
										{
											loader: require.resolve('css-loader'),
											options: {
												importLoaders: 1,
												minimize: true,
												sourceMap: shouldUseSourceMap,
											},
										},
										{
											loader: require.resolve('postcss-loader'),
											options: {
												ident: 'postcss',
												plugins: () => [
													require('postcss-flexbugs-fixes'),
													autoprefixer({
														browsers: [
															'>1%',
															'last 4 versions',
															'Firefox ESR',
															'not ie < 9',
														],
														flexbox: 'no-2009',
													}),
												],
											},
										},
										'sass-loader'
									],
								},
								extractTextPluginOptions
							)
						),
					},
					{
						loader: require.resolve('file-loader'),
						exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
						options: {
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
				],
			},
		],
	},
	plugins: [
		new InterpolateHtmlPlugin(env.raw),
		new HtmlWebpackPlugin({
			inject: true,
			template: paths.appHtml,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		new webpack.DefinePlugin(env.stringified),
		new UglifyJsPlugin({
			uglifyOptions: {
				parse: {
					ecma: 8,
				},
				compress: {
					ecma: 5,
					warnings: false,
					comparisons: false,
					inline: 1,
				},
				mangle: {
					safari10: true,
				},
				output: {
					ecma: 5,
					comments: false,
					ascii_only: true,
				},
			},
			parallel: true,
			cache: true,
			sourceMap: shouldUseSourceMap,
		}),
		new ExtractTextPlugin({
			filename: cssFilename,
		}),
		new ManifestPlugin({
			fileName: 'asset-manifest.json',
		}),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new ForkTsCheckerWebpackPlugin({
			async: false,
			tsconfig: paths.appTsProdConfig,
			tslint: paths.appTsLint,
		}),
	],
	node: {
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty',
	},
};
