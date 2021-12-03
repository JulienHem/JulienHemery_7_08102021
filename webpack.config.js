const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    mode: "development",
    devServer: {
        static: path.resolve(__dirname, '')
    },
    entry: {
        app: "./src/index.js",
    },

    output: {
        filename: "app.bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: '/dist',
    }
};
