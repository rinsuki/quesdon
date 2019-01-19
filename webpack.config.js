const webpack = require("webpack")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const isProduction = process.env.NODE_ENV == "production"

module.exports = {
    mode: isProduction ? "production": "development",

    entry: "./src/client/index.ts",
    output: {
        path: __dirname+"/dist/client",
        filename: "bundle.js",
        publicPath: "/assets/",
    },
    externals: {
        react: "React",
        "react-dom": "ReactDOM",
        "react-router-dom": "ReactRouterDOM",
        "reactstrap": "Reactstrap",
        jquery: "jQuery",
        moment: "moment",
        "popper.js": "Popper",
    },
    devServer: {
        contentBase: "dist/client",
        proxy: {
            "/": "http://localhost:"+(process.env.BACK_PORT || 3000)
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            apiFetch: __dirname+"/src/client/api-fetch.ts"
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    module: {
        rules: [
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.(woff2?|ttf|eot|svg)$/, loader: 'file-loader'},
            {test: /\.tsx?$/, loader: isProduction ? 'babel-loader!ts-loader' : 'ts-loader'},
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    optimization: {
        minimizer: isProduction ? [
            new UglifyJsPlugin({
                uglifyOptions: {
                    keep_classnames: true
                }
            })
        ]: []
    }
}

// if (process.env.NODE_ENV == "production") {
//     module.exports.plugins.push(new UglifyJsPlugin({
//     }))
// }