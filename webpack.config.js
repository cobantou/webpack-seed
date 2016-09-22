var webpack = require("webpack");
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin =require('copy-webpack-plugin');
var pagesJsonList = require('./output.config.js'); //页面配置
const glob = require('glob');

var nodeEnv = process.env.NODE_ENV;
var isProduction = function() {
	return nodeEnv === 'production';
}
var outputDir = path.resolve(__dirname, 'lib');
//生成的html列表
var pagesList = (function readHtmlPages() {
	var HtmlWebpackPluginFun = function(j) {
		return new HtmlWebpackPlugin({
			template: j.template,
			filename: j.filename,
			inject: 'body',
			chunks: j.chuncks,
			hash: isProduction() ? true : false,
			cache: true
		})
	}
	var pagesFactory = function(pgJsonList) {
		var pgList = [];
		for(var i = 0; i < pgJsonList.length; i++) {
			pgList.push(HtmlWebpackPluginFun(pgJsonList[i]))
		}
		return pgList;
	}
	return pagesFactory(pagesJsonList);
}())

//entrys	
var myEntrys = (function() {
	var files = glob.sync('./src/js/entry/*.js');
	var entries = {};
	files.forEach((filePath) => {
		var filename = path.basename(filePath, '.js');
		entries[filename] = path.join(__dirname, filePath);
	})
	return entries;
}())

module.exports = {
	entry: myEntrys,

	output: {

		libraryTarget: "umd",
		path: outputDir,
		filename: isProduction() ? '/js/entry/[name].min.js' : '/js/entry/[name].js',
		chunkFilename: '[name].min.js',
	},

	devServer: {
		historyApiFallback: true,
		hot: true,
		inline: true,
		port: 8888,
		contentBase: './src',
	},

	module: {
		loaders: [{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel"
			}, {
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap&-convertValues')
			}, {
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader?-convertValues!autoprefixer-loader!less-loader')
			}, {
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
				loader: 'file-loader?name=img/[hash:8].[name].[ext]'
			}

		]
	},

	// babel: {
	//     plugins: ['transform-runtime']
	// },

	plugins: [

		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new ExtractTextPlugin("css/[name].css")
		// 提供公共代码
		/*new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
				filename: "js/common.js",
				chunks:['index','index2']
            })*/

	],

	devtool: 'cheap-module-source-map'
};

//生产环境
if(isProduction()) {
	module.exports.devtool = '#source-map'
		// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		new CopyWebpackPlugin([{
			from:  __dirname + '/src/img',
			to: __dirname + '/lib/img',
			ignore:[{ glob:  'spritesrc/**/*', dot: true }]
		}])
		//,
		//new webpack.optimize.OccurenceOrderPlugin()
	])
	
	
}

module.exports.plugins = (module.exports.plugins || []).concat(pagesList);