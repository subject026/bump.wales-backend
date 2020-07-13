const axios = require("axios");
const { link } = require("fs");
/*

*bold \*text*
_italic \*text_
__underline__
~strikethrough~
*bold _italic bold ~italic bold strikethrough~ __underline italic bold___ bold*
[inline URL](http://www.example.com/)
[inline mention of a user](tg://user?id=123456789)
`inline fixed-width code`
```
pre-formatted fixed-width code block
```
```python
pre-formatted fixed-width code block written in the Python programming language
```

*/

const buildMessage = (publishers) => {
  let str = `*bump.wales - new links ${Date.now().toLocaleString()}*`;
  Object.keys(publishers).forEach((pub) => {
    str = str + `\n\n*${pub}*\n`;
    publishers[pub].forEach((link) => {
      str = str + `${link}\n`;
    });
  });
  return str;
};

const sortLinks = (links) => {
  return links.reduce((acc, link) => {
    if (!acc.hasOwnProperty(link.publisher)) acc[link.publisher] = [];
    acc[link.publisher].push(link.link);

    return acc;
  }, {});
};

const sendMessage = async (report) => {
  const publishers = sortLinks(report.newLinks);

  try {
    var str = buildMessage(publishers);

    var telegram_url = encodeURI(
      `https://api.telegram.org/bot${process.env.TELEGRAM_API_KEY}/sendMessage?chat_id=${process.env.CHAT_ID}&text=${str}&parse_mode=Markdown`,
    );
    const { data } = await axios.get(telegram_url);
    if (data.ok) {
      console.log("message sent!");
    } else throw "Something went wrong, please try again";
  } catch (err) {
    console.log(err);
  }
};

module.exports = { buildMessage, sendMessage, sortLinks };
