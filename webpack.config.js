var webpack = require("webpack");
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var pagesJsonList = require('./htmlPage.config.js');//ҳ������

var nodeEnv = process.env.NODE_ENV;//��ǰ����
var outputDir = path.resolve(__dirname, 'lib');
var pagesList=(function readHtmlPages(){	
	var HtmlWebpackPluginFun=function(j){
		return new HtmlWebpackPlugin({
				template: j.template,
				filename: j.filename,
				inject: 'body',
				chunks: j.chuncks,
				hash:true,
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
      filename:nodeEnv ?'/js/entry/[name].min.js':'/js/entry/[name].js' ,// name�ǻ����ϱ�entry�ж����key
	  chunkFilename: '[name].min.js',
   },
   
	// �������������,�Զ�ˢ��!
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        port: 8888,//�˿�
        contentBase: './src',//������վ��Ŀ¼
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
   
   // ת����es5���﷨
   // babel: {
   //     plugins: ['transform-runtime']
   // },
	
	plugins:[
		new webpack.HotModuleReplacementPlugin(),//�ȼ���
		new webpack.optimize.OccurenceOrderPlugin()	
		
	],
	
    devtool: 'cheap-module-source-map'
};


//�ж�Ϊ����ģʽ
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

module.exports.plugins = (module.exports.plugins || []).concat(pagesList);