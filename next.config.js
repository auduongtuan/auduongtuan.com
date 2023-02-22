/** @type {import('next').NextConfig} */
// const withImages = require("next-images");
const withVideos = require("next-videos");
// module.exports = {
//   webpack: (config, options) => {
//     // config.module.rules.push({
//     //   test: /\.(svg|png|jpe?g|gif|mp4)$/i,
//     //   use: [
//     //     {
//     //       loader: 'file-loader',
//     //       options: {
//     //         publicPath: '/_next',
//     //         name: 'static/media/[name].[hash].[ext]'
//     //       }
//     //     }
//     //   ]
//     // })
//     return config
//   },
//   // images: {
//   //   disableStaticImages: true
//   // }
// }
module.exports = withVideos({
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "*.amazonaws.com",
        },
      ],
    },
    reactStrictMode: false,
  }
  // withImages({
  //   images: {
  //     disableStaticImages: true,
  //   },
  // })
);
// module.exports = {
//   webpack: (config, options) => {
//       config.module.rules.push({
//           test: /\.(jpe?g|png|svg|gif|ico|eot|ttf|woff|woff2|mp4|pdf|webm|txt)$/,
//           type: 'asset/resource',
//           generator: {
//               filename: 'static/chunks/[path][name].[hash][ext]'
//           },
//       });

//       return config;
//   },
//   images: {
//     disableStaticImages: true,
//   }
// };
