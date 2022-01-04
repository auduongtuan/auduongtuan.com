const glob = require("glob");
const fs = require("fs");
const path = require("path");
const sizeOf = require('image-size');
glob("content/projects/*.mdx", (error, files) => {
  if (error) {
    console.log(error)
  }
  else {
    files.forEach(function (file) {
      const slug = path.basename(file, path.extname(file));
      console.log(slug);
      fs.readFile(file, function (err, data) {
          if (err) {
              console.log(err);
          } else {
              const newData = data.toString().replace(/!\[(.+)\]\((.+)\)/g, (match, alt, src) => {
                console.log(match, alt, src);
                const dimensions = sizeOf('content/uploads/' + slug + '/' + src);
                const newstring = `<Image src="${src}" alt="${alt}" width={${dimensions.width}} height={${dimensions.height}} />`;
                return newstring;
              });
              console.log(newData);
              fs.writeFile(file, newData, 'utf8', function (err) {
                if (err) return console.log(err);
                console.log(`${slug} updated`);
              });
          }
      });
  });
  }
});
