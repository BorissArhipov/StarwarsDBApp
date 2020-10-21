const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = (env = {}) => {

    return {
        mode: 'development',
        output: {
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,            
                    use: [
                        {
                            loader: 'babel-loader'
                        }
                    ],
                    exclude: '/node_modules/'
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: MiniCssExtractPlugin.loader },
                        { loader: 'css-loader'}
                    ]
                },
                {
                    test: /\.(s[ca]ss)$/,
                    use: [
                        { loader: MiniCssExtractPlugin.loader },
                        { loader: 'css-loader'},
                        { loader: 'sass-loader'}
                    ]
                },
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'images',
                                name: '[name]-[sha1:hash:7].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(ttf|otf|eot|woff|woff2)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'fonts',
                                name: '[name].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'public/index.html'
            }),
            new MiniCssExtractPlugin({
                filename: 'main-[hash:8].css'
            })
        ],

        devServer: {
            open: true,
            historyApiFallback: true
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {

                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            
                            return `npm.${packageName.replace('@', '')}`;
                        },
                    },
                },
            },
            minimize: true,
            minimizer: [
                new CssMinimizerPlugin(),
                new UglifyJsPlugin()
            ],
        },
    }
};