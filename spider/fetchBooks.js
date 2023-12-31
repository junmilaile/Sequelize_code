// 抓取豆瓣读书中的数据信息
const axios = require("axios").default;
const cheerio = require("cheerio");
const Book = require("../models/Book");
/**
 * 获取豆瓣读书网页的源代码
 */
async function getBooksHTML() {
  let resp = [];
  for (let i = 2; i <= 5; i++) {
    resp.push(axios.get(`https://book.douban.com/latest?subcat=%E5%85%A8%E9%83%&p=${i}`));
  }
  return Promise.all(resp);
}

/**
 * 从豆瓣读书中得到一个完整的网页，并从网页中分析出书籍的基本信息，然后得到一个书籍的详情页链接数组
 */
async function getBookLinks() {
  const html = await getBooksHTML();
  const links = html.map(item => {
    const $ = cheerio.load(item.data);
    const achorElements = $("#content .grid-16-8 .chart-dashed-list li .media__img  a");
    const achorElements2 = $("#content .grid-16-8  .aside .entry-list-col3 li p a");
    const links = achorElements
      .map((i, ele) => {
        const href = ele.attribs["href"];
        return href;
      })
      .get();

    const linksAll = achorElements2
      .map((i, ele) => {
        const href = ele.attribs["href"];
        return href;
      })
      .get();
    links.push(...linksAll);
    return links
  })
  return links.flat();
}

/**
 * 根据书籍详情页的地址，得到该书籍的详细信息
 * @param {*} detailUrl
 */
async function getBookDetail(detailUrl) {
  const resp = await axios.get(detailUrl);
  const $ = cheerio.load(resp.data);
  const name = $("h1").text().trim();
  const imgurl = $("#mainpic .nbg img").attr("src");
  const spans = $("#info span.pl");
  const authorSpan = spans.filter((i, ele) => {
    return $(ele).text().includes("作者");
  });
  const author = authorSpan.next("a").text().trim();
  const publishSpan = spans.filter((i, ele) => {
    return $(ele).text().includes("出版年");
  });
  const publishDate = publishSpan[0].nextSibling.nodeValue.trim();
  return {
    name,
    imgurl,
    publishDate,
    author,
  };
}

/**
 * 获取所有的书籍信息
 */
async function fetchAll() {
  const links = await getBookLinks(); //得到书籍的详情页地址
  const proms = links.map(link => {
    return getBookDetail(link);
  });
  return Promise.all(proms);
}

/**
 * 得到书籍信息，然后保存到数据库
 */
async function saveToDB() {
  const books = await fetchAll();
  await Book.bulkCreate(books);
  console.log("抓取数据并保存到了数据库");
}

saveToDB();
