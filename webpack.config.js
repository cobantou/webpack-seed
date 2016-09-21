var webpack = require("webpack");
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var pagesJsonList = require('./htmlPage.config.js');//页面配置

var nodeEnv = process.env.NODE_ENV;
var isProduction=function(){
	return nodeEnv=== 'production';
}
var outputDir = path.resolve(__dirname, 'lib');
//生成的html列表
var pagesList=(function readHtmlPages(){	
	var HtmlWebpackPluginFun=function(j){
		return new HtmlWebpackPlugin({
				template: j.template,
				filename: j.filename,
				inject: 'body',
				chunks: j.chuncks,
				hash:isProduction()?true:false,
				cache:true
			})
	}
	var pagesFactory=function(pgJsonList){
		var pgList=[];
		for(var i=0;i<pgJsonList.length;i++){
			pgList.push(HtmlWebpackPluginFun(pgJsonList[i]))
		}
		return pgList;
	}
	return pagesFactory(pagesJsonList);
}())

		
	

module.exports = {
   entry: {
	   index:path.join(__dirname, 'src/js/entry/index.js'),
	   index2:path.join(__dirname, 'src/js/entry/index2.js'),
   },  

   output: {

      libraryTarget: "umd",
	  path:outputDir  ,
      filename:isProduction() ?'/js/entry/[name].min.js':'/js/entry/[name].js' ,
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
      loaders: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel"
         }
      ]
   },
   

   // babel: {
   //     plugins: ['transform-runtime']
   // },
	
	plugins:[
		new webpack.HotModuleReplacementPlugin(),//�ȼ���
		new webpack.optimize.OccurenceOrderPlugin()	
		
	],
	
    devtool: 'cheap-module-source-map'
};


//生产环境
if (isProduction()) {
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

module.exports.plugins = (module.exports.plugins || []).concat(pagesList);