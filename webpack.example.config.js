var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var path = require('path');

var srcdir = path.join(__dirname, 'example/src')
var distdir = path.join(__dirname, 'example/dist')

module.exports = {
	context: srcdir,
	entry: "./index.js",
	output: {
		path: distdir,
		filename: "bundle.js"
	},
	plugins: [
		new CopyWebpackPlugin([
			{ from: './index.html' },
		]),
		new ExtractTextPlugin('styles.css', {
			allChunks: true
		}),
	],
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'three': 'THREE'
	},
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'eslint'
			},
		],
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				test: /\.png$/,
				loader: "file?name=build/[path][name].[ext]"
			},
			{
				test:   /\.css$/,
				loader: ExtractTextPlugin.extract('style', [
					"css?modules&sourceMap&localIdentName=[name]-[local]-[hash:base64:6]",
					"postcss",
				])
			}
		],
	},
	devServer: {
		contentBase: distdir,
		port: 3000
	},
	devtool: 'source-map',
	eslint: {
		configFile: './.eslintrc'
	},
	postcss: function (webpack) {
		return [
			 require("postcss-cssnext")(),
		];
	},
};

