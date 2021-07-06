const fs = require("fs");
const http = require("http");
const { URL } = require("url");

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

const port = 8000;

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const replaceTemplate = (template, product) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const server = http.createServer((req, res) => {
  const myUrl = new URL( req.url ,`https://127.0.0.1:8000`);
  const pathname = myUrl.pathname;
  const query = myUrl.searchParams.get('id');

  //Overview Page
  if (pathname == "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);

    //Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query];

    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //Api
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //Not Found Page
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-header": "hello world!",
    });
    res.end("<h2>Page not found</h2>");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`started listening on port ${port}`);
});
