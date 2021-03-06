const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/nullius.js',
    output: {
        path: path.resolve('dist'),
        filename: 'nullius.js',
        // path: path.resolve('src/build'),
        // filename: 'build.js',
        libraryTarget: 'commonjs2',
        publicPath: ''
    },
    plugins: [new CleanWebpackPlugin(), new NodePolyfillPlugin()],
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            generator: (content, mimetype, encoding, resourcePath) => {
                                return `data:${mimetype}${encoding ? `;${encoding}` : ''},${content.toString(encoding)}`;
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            react: path.resolve(__dirname, './node_modules/react'),
            'react-dom/client': path.resolve(__dirname, './node_modules/react-dom/client')
        }
    },
    externals: {
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'React',
            root: 'React'
        },
        'react-dom/client': {
            commonjs: 'react-dom/client',
            commonjs2: 'react-dom/client',
            amd: 'ReactDOM',
            root: 'ReactDOM'
        }
    }
};
