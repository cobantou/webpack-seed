var webpack = require("webpack");
var path = require('path');

var nodeEnv = process.env.NODE_ENV;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var outputDir = path.resolve(__dirname, 'lib');
var jsVersion="20160920";

module.exports = {

 
   entry: {
	   index:path.resolve(__dirname, 'src/js/entry/index.js'),
	   index2:path.resolve(__dirname, 'src/js/entry/index2.js'),
   },   // output tells webpack where to put the bundle it creates
  //  output: {
  //  path: 'build',
  //  filename: '[name].js' // name是基于上边entry中定义的key
  //}
   output: {
      libraryTarget: "umd",
	  path:outputDir  ,
      filename:nodeEnv ?'/js/entry/[name]_'+jsVersion+'.min.js':'/js/entry/[name]_'+jsVersion+'.js' // name是基于上边entry中定义的key
   },
   
	// 服务器配置相关,自动刷新!
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        port: 8888,//端口
        contentBase: './',//配置网站根目录
    },
	
   module: {
      loaders: [
         // babel loader, testing for files that have a .js extension
         // (except for files in our node_modules folder!).
         {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel"
         }
      ]
   },
   
   // 转化成es5的语法
   // babel: {
   //     plugins: ['transform-runtime']
   // },
	
	plugins:[
		new webpack.HotModuleReplacementPlugin(),//热加载
		new webpack.optimize.OccurenceOrderPlugin(),
		new HtmlWebpackPlugin({
			template: 'index.html',
			filename: outputDir+'/index.html',
			inject: 'body',
			chunks: ['index']
		})
		
	],
	
    devtool: 'cheap-module-source-map'
};


//判断为生产模式,压缩js
if (process.env.NODE_ENV === 'production') {
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
    })
	//,
    //new webpack.optimize.OccurenceOrderPlugin()
  ])
}