const sharp = require('responsive-loader/sharp');

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        data: '@import "src/assets/styles";',
      },
    },
  },
  chainWebpack(config) {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        const fallback = options.fallback;

        fallback.loader = 'responsive-loader';

        fallback.options = {
          ...fallback.options,
          adapter: sharp,
          sizes: [150, 300, 768, 1024],
          placeholder: true,
          format: 'jpg',
        };

        return options;
      });

    config.module
      .rule('obj')
      .test(/\.obj$/)
      .use('file-loader')
      .loader('file-loader')
      .end();
  },
};
