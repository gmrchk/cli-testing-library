const TerserPlugin = require('terser-webpack-plugin');
const packageJson = require('package.json')

const baseConfig = {
    mode: 'production',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
                include: /(min|by)\.js$/,
            }),
        ],
    },
};

const config = Object.assign({}, baseConfig, {
    entry: {
        [packageJson.name]: './src/entry.ts',
        [`${packageJson.name}.min`]: './src/entry.ts',
    },
    output: {
        path: __dirname + '/dist/',
        library: packageJson.title,
        libraryTarget: 'umd',
        filename: '[name].js',
    },
});

module.exports = (env, argv) => config;
