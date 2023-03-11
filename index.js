const webpack = require('webpack');
const { RawSource } = webpack.sources || require('webpack-sources');
const path = require("path");
const fs = require("fs");
const postcss = require('postcss');
const less = require('less');
const NpmImportPlugin = require('less-plugin-npm-import');
const hash = require('hash.js');

const exportFileName = 'yuheng-color.css';
const stylesDir = path.join(__dirname, "./src/styles");
const sourceFrom = path.join(__dirname, "./src/styles/index.less");
const defaultOutputDir = '/css';

/* 缓存优化二次构建速度 */
let cssCache = '';
let hashCache = '';

const reducePlugin = postcss.plugin('reducePlugin', () => (css) => {
  css.walkAtRules(atRule => {
    atRule.remove();
  });

  css.walkComments(c => c.remove());
});

class ThemePlugin {
  constructor(options = {}) {
    const defaultOptions = {
      tdLibDir: path.join(__dirname, "../../node_modules/tdesign-vue"),
      indexFileName: "index.html",
      generateOnce: false,
      output: defaultOutputDir,
    };
    const tdLibStylesFile = options.tdLibStylesFile || path.join(options.tdLibDir || defaultOptions.tdLibDir, "./dist/tdesign.min.css");
    this.options = Object.assign(defaultOptions, options, { stylesDir, tdLibStylesFile });
    this.version = webpack.version;
  }

  apply(compiler) {
    const pluginName = 'ThemePlugin';
    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) =>
      this.addAssets(compilation, compilation.assets, callback));
  }

  async addAssets(compilation, assets, callback) {
    this.generateIndexContent(assets, compilation);
    const { generateOnce } = this.options;

    if (generateOnce && this.colors) {
      this.generateColorStylesheet(compilation, this.colors);
      return callback();
    }
    try {
      const css = await this.generateCssContent();
      cssCache = css;
      if (generateOnce) {
        this.colors = css;
      }
      this.generateColorStylesheet(compilation, css);
      callback();
    } catch (error) {
      callback(error);
    }
  };

  /**
   * transform all less file into css file
   * @returns {Promise<string>} css string promise
   */
  async generateCssContent() {
    const { stylesDir, tdLibStylesFile } = this.options;
    const fileContent = fs.readFileSync(sourceFrom).toString();
    const css = await less.render(fileContent, {
      paths: [tdLibStylesFile, stylesDir],
      filename: path.resolve(sourceFrom),
      javascriptEnabled: true,
      plugins: [new NpmImportPlugin({ prefix: "~" })],
    })
      .then(res => res.css)
      .catch(err => {
        console.error(`Error occurred compiling file ${sourceFrom}`);
        console.error("Error", err);
        return "\n";
      });

    const hashCode = hash.sha256().update(css).digest('hex');
    if (hashCode === hashCache) {
      return cssCache;
    }
    hashCache = hashCode;
    const results = await postcss([reducePlugin]).process(css, {
      from: sourceFrom,
    });
    const minifiedCss = minifyCss(results.css);

    return minifiedCss;
  }

  generateIndexContent(assets, compilation) {
    if (
      this.options.indexFileName &&
      this.options.indexFileName in assets
    ) {
      const index = assets[this.options.indexFileName];
      const content = index.source();

      if (!content.match(/\/yuheng-color\.less/g)) {
        const less = `
          <link rel="stylesheet" href="/${exportFileName}" />
          <script>
            window.less = {
              async: false,
              env: 'production'
            };
          </script>
        `;

        const updatedContent = content.replace(less, "").replace(/<body>/gi, `<body>${less}`);

        if (this.version.startsWith('5.')) {
          compilation.updateAsset(this.options.indexFileName, new RawSource(updatedContent), { size: updatedContent.length });
          return;
        }

        index.source = () => updatedContent;
        index.size = () => updatedContent.length;
      }
    }
  };

  generateColorStylesheet(compilation, source) {

    if (this.version.startsWith('5.')) {
      compilation.emitAsset(exportFileName, new RawSource(source), { size: source.length });
      return;
    }

    compilation.assets[exportFileName] = {
      source: () => source,
      size: () => source.length
    };
  };
}


module.exports = ThemePlugin;

function minifyCss(css) {
  // Removed all comments and empty lines
  css = css
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
    .replace(/^\s*$(?:\r\n?|\n)/gm, "");

  /*
  Converts from

    .abc,
    .def {
      color: red;
      background: blue;
      border: grey;
    }

    to

    .abc,
    .def {color: red;
      background: blue;
      border: grey;
    }

  */
  css = css.replace(/\{(\r\n?|\n)\s+/g, "{");

  /*
  Converts from

  .abc,
  .def {color: red;
  }

  to

  .abc,
  .def {color: red;
    background: blue;
    border: grey;}

  */
  css = css.replace(/;(\r\n?|\n)\}/g, ";}");

  /*
  Converts from

  .abc,
  .def {color: red;
    background: blue;
    border: grey;}

  to

  .abc,
  .def {color: red;background: blue;border: grey;}

  */
  css = css.replace(/;(\r\n?|\n)\s+/g, ";");

  /*
Converts from

.abc,
.def {color: red;background: blue;border: grey;}

to

.abc, .def {color: red;background: blue;border: grey;}

*/
  css = css.replace(/,(\r\n?|\n)[.]/g, ", .");
  return css;
}