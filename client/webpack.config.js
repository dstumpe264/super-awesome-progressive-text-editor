const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin')

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js',
      editor: './src/js/editor.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: '/index.html',
        title: 'Tex-Ed'
      }),

      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js',
      }),

      new GenerateSW({
          // Do not precache images
        exclude: [/\.(?:png|jpg|jpeg|svg)$/],

        // Define runtime caching rules.
        runtimeCaching: [{
          // Match any request that ends with .png, .jpg, .jpeg or .svg.
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

          // Apply a cache-first strategy.
          handler: 'CacheFirst',

          options: {
            // Use a custom cache name.
            cacheName: 'images',

            // Only cache 2 images.
            expiration: {
              maxEntries: 2,
            },
          },
        }],
      }),

      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'Tex-Ed',
        short_name: 'TexEd',
        description: 'Super awesome progressive text editor',
        start_url: './',
        publicPath: './',

      })
    ],

    resolve: {
      fallback: {
        util: require.resolve("util/")
      }
    },

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
            }
          }

        }

      ],
    },
  };
};
