const axios = require("axios");
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
const sendMessage = async (message) => {
  try {
    var str = `
        *bump.wales - new links*
          
        *State Of Wales*
        jdrf ghsdjkgh dljkgh djkfghs djklhsldjkfhg skjdfhg sljhgfl sjghl j
        jdrf ghsdjkgh dljkgh djkfghs djklhsldjkfhg skjdfhg sljhgfl sjghl j
        jdrf ghsdjkgh dljkgh djkfghs djklhsldjkfhg skjdfhg sljhgfl sjghl j

        *Oggy Bloggy Ogwr*
        jdrf ghsdjkgh dljkgh djkfghs djklhsldjkfhg skjdfhg sljhgfl sjghl j
        jdrf ghsdjkgh dljkgh djkfghs djklhsldjkfhg skjdfhg sljhgfl sjghl j`;

    var telegram_url = encodeURI(
      `https://api.telegram.org/bot${process.env.TELEGRAM_API_KEY}/sendMessage?chat_id=${process.env.CHAT_ID}&text=${str}&parse_mode=Markdown`
    );
    const { data } = await axios.get(telegram_url);
    if (data.ok) {
      console.log("message sent!");
    } else throw "Something went wrong, please try again";
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMessage;
