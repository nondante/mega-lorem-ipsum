const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require("@babel/register");
const lodashId = require("lodash-id");
const FileSync = require("lowdb/adapters/FileSync");
const low = require("lowdb");
const _ = require('lodash');
const bodyParser = require('body-parser');

const adapter = new FileSync("db.json");
const db = low(adapter);
db._.mixin(lodashId);
db.defaults({ people: [] });

const config = {
  entry: ['@babel/polyfill','./src/index.js'],
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  module: {
    rules : [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
        hash: true
    })
  ],
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },
  devServer: {
    before: function(app) {
      app.get("/people", function(req, res) {
        res.json(db);
      });
    },
    after: function(app) {
      app.use(bodyParser.json());
      app.get("/people/:id", function(req, res) {
        res.json(db.get('people').find({ id: req.params.id }));
      });
      app.post("/people", (req, res) => {
        const newProduct = req.body;
        res.json(db.get('people').insert(newProduct).write());
      });
      app.put('/people/:id', (req, res) => {
        res.json(
          db.get('people').find({ id: req.params.id }).assign(req.body).write(),
        );
      });
      app.delete('/people/:id', (req, res) => {
        db.get('people').remove({ id: req.params.id }).write();
        res.status(204).send();
      });
    },
    contentBase: __dirname + '/public',
    compress: true,
    port: 9000,
    open: true,
    stats: {
        assets: false,
        children: false,
        chunks: false,
        chunkModules: false,
        colors: true,
        entrypoints: false,
        hash: false,
        modules: false,
        timings: false,
        version: false,
    }
  },
  watch: false,
  devtool: 'source-map',
};

module.exports = config;