const webpack = require("webpack")

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
        })
    ],
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.tag$/, exclude: /node_modules/, loader: 'riot-tag-loader', query: {
                type: "none",
                template: "pug"
            }},
            {test: /\.(woff2?|ttf|eot|svg)$/, loader: 'file-loader'},
            {test: /\.ts$/, loader: 'ts-loader'},
        ]
    }
}