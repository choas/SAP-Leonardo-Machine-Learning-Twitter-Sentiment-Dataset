"use strict";

const fs = require("fs");
const archiver = require("archiver");

const TAKE_EVERY = (process.argv.length > 2) ? process.argv[2] : 100;

const labels = { "0": "negative", "1": "positive" };

const P_TR = 80;
const P_TE = 10;
const P_VA = 10;

const PATH = "sentiment" + ((TAKE_EVERY > 1) ? "_" + TAKE_EVERY : "");
const TRAIN_PATH = "training";
const TEST_PATH = "test";
const VALID_PATH = "validation";

_mkdir(PATH);
_mkdir(PATH + "/" + TRAIN_PATH);
_mkdir(PATH + "/" + TEST_PATH);
_mkdir(PATH + "/" + VALID_PATH);

Object.values(labels).forEach((label) => {
  _mkdir(PATH + "/" + TRAIN_PATH + "/" + label);
  _mkdir(PATH + "/" + TEST_PATH + "/" + label);
  _mkdir(PATH + "/" + VALID_PATH + "/" + label);
});

var p_tr = P_TR, p_te = P_TE, p_va = P_VA;
var c_tr = 0, c_te = 0, c_va = 0;
var total = 0;

var output = fs.createWriteStream(__dirname + "/" + PATH + ".zip");
var archive = archiver("zip", {
  store: true
  // zlib: { level: 1 } // Sets the compression level.
});

// listen for all archive data to be written
// "close" event is fired only when a file descriptor is involved
output.on("close", function() {
  console.log(archive.pointer() + " total bytes");
  console.log("archiver has been finalized and the output file descriptor has closed.");
});
 
// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on("end", function() {
  console.log("Data has been drained");
});
 
// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on("warning", function(err) {
  if (err.code === "ENOENT") {
    // log warning
  } else {
    // throw error
    throw err;
  }
});
 
// good practice to catch this error explicitly
archive.on("error", function(err) {
  throw err;
});
 
// pipe archive data to the file
archive.pipe(output);

fs.readFile("Sentiment Analysis Dataset.csv", (e, data) => {

  const lines = data.toString().split("\n");

  var linecount = 0;
  lines.forEach((line) => {

    const col = line.split(",");
    var txt = col[3];
    for (var i = 4; i < col.length; i++) {
      txt += "," + col[i];
    }
    if (txt && linecount > 0 && linecount % TAKE_EVERY == 0) {
      txt = "" + txt;
      if (txt.indexOf("\"") === 0) {
        txt = txt.substr(1, txt.length - 3);
      }
      txt = txt.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "-").replace(/&quot;/g, "\"");

      const filename = path() + labels[col[1]] + "/" + col[0] + ".txt";

      archive.append(txt, { name: filename });
    }
    linecount += 1;
  });

  console.log("finalize zip file" + TAKE_EVERY <= 10 ? " ... this can take some time" : "");
  if (TAKE_EVERY < 5) {
    console.log("every long");
  }
  archive.finalize();

});


function path() {

  var t = "";
  var r = Math.floor(Math.random() * (p_tr + p_te + p_va));
  if (r < p_tr) {
    t = TRAIN_PATH;
    c_tr += 1;
  } else if (r < p_tr + p_te) {
    t = TEST_PATH;
    c_te += 1;
  } else {
    t = VALID_PATH;
    c_va += 1;
  }

  let dest = t + "/";

  // adjust balance between trainig, test and validation data set
  total = (c_tr + c_te + c_va);
  if (total % 100 == 0) {
    p_tr += (P_TR - Math.round(c_tr / total * 100));
    p_te += (P_TE - Math.round(c_te / total * 100));
    p_va += (P_VA - Math.round(c_va / total * 100));
  }

  if (total % 10000 == 0) {
    // 
    console.log(Math.round(c_tr / total * 100), Math.round(c_te / total * 100), Math.round(c_va / total * 100), total);
  }

  return dest;
}

function _mkdir(path) {
  try {
    fs.mkdirSync(path);
  } catch (e) {
    if (e.code !== "EEXIST") {
      throw e;
    }
  }
}
