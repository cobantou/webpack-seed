var webpack = require("webpack");
var path = require('path');

var nodeEnv = process.env.NODE_ENV;


module.exports = {

 
   entry: {
	   index:path.resolve(__dirname, 'src/js/entry/index.js'),
	   index2:path.resolve(__dirname, 'src/js/entry/index2.js'),
   },   // output tells webpack where to put the bundle it creates
  //  output: {
  //  path: 'build',
  //  filename: '[name].js' // name�ǻ����ϱ�entry�ж����key
  //}
   output: {

      libraryTarget: "umd",
	  path:  path.resolve(__dirname, 'lib/js/entry'),
      filename:nodeEnv ?'[name].min.js':'[name].js' // name�ǻ����ϱ�entry�ж����key
   },
   
	// �������������,�Զ�ˢ��!
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        port: 8888,//�˿�
        contentBase: './',//������վ��Ŀ¼
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
   
   // ת����es5���﷨
   // babel: {
   //     plugins: ['transform-runtime']
   // },
	
	plugins:[
		new webpack.HotModuleReplacementPlugin(),//�ȼ���
		new webpack.optimize.OccurenceOrderPlugin(),
		
	],
	
    devtool: 'cheap-module-source-map'
};


//�ж�Ϊ����ģʽ,ѹ��js
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