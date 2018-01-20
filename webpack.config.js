const webpack = require("webpack")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

module.exports = {
    entry: "./src/client/index.ts",
    output: {
        path: __dirname+"/dist/client",
        filename: "bundle.js",
        publicPath: "/assets/",
    },
    devServer: {
        contentBase: "dist/client",
        proxy: {
            "/": "http://localhost:"+(process.env.BACK_PORT || 3000)
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            riot: "riot",
            "$": "jquery",
            apiFetch: __dirname+"/src/client/api-fetch.ts"
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.tag$/, exclude: /node_modules/, use: [
                {loader: 'babel-loader'},
                {loader: 'riot-tag-loader', query: {
                    type: "none",
                    template: "pug"
                }}
            ]},
            {test: /\.(woff2?|ttf|eot|svg)$/, loader: 'file-loader'},
            {test: /\.tsx?$/, loader: 'ts-loader'},
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    }
}

if (process.env.NODE_ENV == "production") {
    module.exports.plugins.push(new UglifyJsPlugin({
        uglifyOptions: {ecma: 6}
    }))
}