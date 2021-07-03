const fs = require("fs");
const http = require("http");
const url = require("url");

/*--------------------------*/
//Filesystem

//Blocking, Synchronous way
// const textInput = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textInput);
// const textOutput = `This is what we know about avocado ${textInput}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOutput);
// console.log('file written');

//Non-blocking, Asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR! ");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, (err) => {
//         console.log("file has been written");
//       });
//     });
//   });
// });
// console.log("Will read from file!");

/*--------------------------*/
//Server

const port = 3000;

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url == "/" || url == "/overview") {
    res.end("This is the OVERVIEW");
  } else if (url == "/product") {
    res.end("This is the PRODUCT");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`started listening on port ${port}`);
});
