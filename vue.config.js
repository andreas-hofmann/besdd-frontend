if (process.env.NODE_ENV !== 'production') {
    var publicPath = "http://127.0.0.1:8080/";
    var BundleTracker = require("webpack-bundle-tracker");
} else {
    var publicPath = "/static/";
}

module.exports = {
    publicPath: publicPath,
    outputDir: './dist/',

    chainWebpack: config => {

        if (process.env.NODE_ENV !== 'production') {
            config.optimization
                .splitChunks(false)

            config
                .plugin('BundleTracker')
                .use(BundleTracker, [{filename: '../frontend/webpack-stats.json'}])

            config.resolve.alias
                .set('__STATIC__', 'static')

            config.devServer
                .public('http://127.0.0.1:8080')
                .host('127.0.0.1')
                .port(8080)
                .hotOnly(true)
                .watchOptions({poll: 1000})
                .https(false)
                .headers({"Access-Control-Allow-Origin": ["\*"]})
        }
    }
};