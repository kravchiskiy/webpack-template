const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { UseBuiltInsOption } = require('@babel/preset-env/lib/options');
module.exports = (env) => {
	const isDev = env.mode === 'development';
	return {
		//0. задать mode
		// mode: 'development',
		// mode: 'production',
		mode: env.mode ?? 'development',
		//1. задать точку входа
		entry: path.resolve(__dirname, 'src/js', 'index.js'),
		//2. задать файл на выходе, и паппку для сборки, включить клинер.
		output: {
			path: path.resolve(__dirname, 'build'),
			filename: 'js/[name].[contenthash].js',
			// filename: 'bundle.js',
			clean: true,
		},
		devServer: isDev
			? {
					port: 5500,
					open: false,
					compress: true,

					static: {
						directory: './public',
						publicPath: '/',
						watch: true,
					},
					client: {
						overlay: true,
					},
					hot: true,
			  }
			: undefined,
		devtool: isDev ? 'source-map' : false,
		module: {
			rules: [
				{
					test: /\.((c|sa|sc)ss)$/i,
					use: [
						// MiniCssExtractPlugin.loader,
						// 'style-loader',
						isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
						'css-loader',
						'postcss-loader',
						'sass-loader',
					],
				},
				{
					test: /\.(png|svg|jpg|jpeg|gif)$/i,
					type: 'asset/resource',
					generator: {
						filename: 'images/[name][ext]',
					},
				},
				// {
				// 	test: /\.(png|gif|jpe?g|svg)$/i,
				// 	type: 'asset/resource',
				// 	// parser: {
				// 	// 	dataUrlCondition: {
				// 	// 		maxSize: environment.limits.images,
				// 	// 	},
				// 	// },
				// generator: {
				// 	filename: 'images/[name].[hash:6][ext]',
				// },
				// },
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										debug: true,
										corejs: 3,
										useBuiltIns: 'usage',
									},
								],
							],
						},
					},
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, 'src', 'index.html'),
			}),
			!isDev &&
				new MiniCssExtractPlugin({
					filename: 'css/[name].[contenthash:8].css',
					chunkFilename: 'css/[name].[contenthash:8].css',
				}),
			!isDev &&
				new CopyWebpackPlugin({
					patterns: [
						{
							from: path.resolve(
								path.resolve(__dirname, 'public'),
								'images'
							),
							to: path.resolve(
								path.resolve(__dirname, 'build'),
								'images'
							),
							toType: 'dir',
							globOptions: {
								ignore: ['*.DS_Store', 'Thumbs.db'],
							},
						},
						// {
						//   from: path.resolve(environment.paths.source, 'videos'),
						//   to: path.resolve(environment.paths.output, 'videos'),
						//   toType: 'dir',
						//   globOptions: {
						//     ignore: ['*.DS_Store', 'Thumbs.db'],
						//   },
						// },
					],
				}),
		],
		// resolve: {
		// 	aliase: {
		// 		'@': path.resolve(__dirname, 'src'),
		// 	},
		// },
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src/'), // maps @something to path/to/something
				'~': path.resolve(__dirname, 'public/'),
			},
		},
		optimization: {
			// runtimeChunk: 'single',
		},
	};
};
