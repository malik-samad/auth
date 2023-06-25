const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require("copy-webpack-plugin");
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const {
    NODE_ENV = 'production',
} = process.env;

module.exports = {
    entry: './src/server.ts',
    mode: NODE_ENV,
    watch: NODE_ENV == "development",
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: `.env.${NODE_ENV}` },
                ...(NODE_ENV === 'development' ? [{ from: `.env.local` }] : []),
                { from: `package.json` },
            ],
        }),
        ...(NODE_ENV == "development" ?
            [new WebpackShellPluginNext({
                onBuildEnd: {
                    scripts: ['nodemon build'],
                    blocking: false,
                    parallel: true
                }
            })] :
            []
        )
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    externals: [nodeExternals()],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build'),
        library: "handler",
        // libraryTarget: 'umd',
        // globalObject: 'this',
    },
};