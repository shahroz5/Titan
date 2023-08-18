const glob = require('glob');
const fsextra = require('fs-extra');
const fs = require('fs');
const path = require('path');
const concat = require('concat');
class CopyOperation {
  constructor(private console: Console) {}
  consolidateFile(source: string, destination: string) {
    glob(source, {}, function(er, files) {
      fs.mkdirSync(`${destination}`, { recursive: true });
      const stream = fs.createWriteStream(`${destination}/lcov.info`, {
        flags: 'a+'
      });
      concat(files).then(result => {
        stream.write(result + '\n');
      });
    });
  }
  deleteFiles(filePath: string) {
    fs.unlink(`${filePath}`, err => {
      if (err) {
        console.log(`${filePath}:${err}`);
      } else {
        console.log(`${filePath} was remove and new lcov.info file created.`);
      }
    });
  }
}

const copyOps = new CopyOperation(console);
copyOps.deleteFiles('coverage/all/lcov.info');
copyOps.consolidateFile('coverage/**/lcov.info', 'coverage/all');
