const fs = require('fs')
const path = require('path')

function cleanTemp() {

  const directory = process.env.TEMPORARY_FOLDER_PATH;

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      })
    }
  })
}

module.exports = {
  cleanTemp
};