// libs
import path from 'path'
// Plugins
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'


export default {

    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@': path.resolve('src')
        },
        modules: [
            path.resolve('src'),
            'node_modules',
        ],
    },

    entry: {
        popup: './src/popup.js',
        content: './src/content.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },

    module: {
        rules: [
            // JS
            {
                test: /\.js$|\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            },
            // Style
            {
                test: /\.css$/,
                include: path.resolve(__dirname, "node_modules/antd"),
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                })
            },
            {
                test: /\.less$/,
                include: path.resolve(__dirname, "node_modules/antd"),
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']
                })
            },
            {
                test: /\.(css|less)$/,
                exclude: path.resolve(__dirname, "node_modules/antd"),
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                minimize: true,
                                modules: true,
                                importLoaders: true,
                                localIdentName: '[local]__[hash:6]'
                            }
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                })
            },
            // SVG Font
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000, // 小于此值转为 base64
                        mimetype: 'image/svg+xml',
                    }
                }
            },
            // Web Font
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: 'url-loader'
            },
            // Common ImageOverlay Formats
            {
                test: /\.(ico|gif|png|jpg|jpeg|webp)$/,
                use: 'url-loader'
            },
            // Common Media Formats
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: 'url-loader'
            },
        ]
    },

    stats: {
        children: false,
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        modules: false
    },

    plugins: [
        // Css分离到单独文件
        new ExtractTextPlugin('[name].bundle.css'),
        // 自动注入引用链接
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ['popup'],
            filename: 'popup.html',
            template: './src/popup.html'
        }),
        // 复制文件到 dist 文件夹
        new CopyWebpackPlugin([
            {
                from: './src/manifest.json'
            },
            {
                context: './src/assets',
                from: 'icon*',
                to: 'assets'
            }
        ])
    ]
}