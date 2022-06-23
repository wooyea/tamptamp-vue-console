const http = require('http');
const {
  createWriteStream, mkdir, unlink, rm,
} = require('fs');
const { exit } = require('process');
const { Extract } = require('unzipper');
const Config = require('../config');

const packFilePath = 'apiPack.zip';
createWriteStream(packFilePath);
const { backendServer } = Config;
const extractPath = './src/libs';
const packUrl = `${backendServer}/swagger/apipack`;

rm(`${extractPath}/api`, { recursive: true }, (error) => {
  if (error) {
    console.log(error);
  }
});

mkdir(extractPath, { recursive: true }, () => {
  console.log(`download api pack from url:${packUrl}`);
  http.get(packUrl, (response) => {
    if (response.statusCode !== 200) {
      console.warn(`download api pack from url:${packUrl} failed!`);
      exit(-1);
    }

    console.warn('extracting downloaded file!');
    response.pipe(Extract({ path: extractPath }));

    unlink(packFilePath, (error) => {
      if (error) {
        console.log(error);
      }
    });
  });
});
