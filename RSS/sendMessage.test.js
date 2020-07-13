const { buildMessage, sortLinks } = require("./sendMessage");

const links = [
  { publisher: "publisher1", link: "linkyyyy" },
  { publisher: "publisher1", link: "linkyyyy" },
  { publisher: "publisher1", link: "linkyyyy" },
  { publisher: "publisher1", link: "linkyyyy" },
  { publisher: "publisher1", link: "linkyyyy" },
  { publisher: "publisher1", link: "linkyyyy" },
  { publisher: "publisher2", link: "linkyyyy" },
  { publisher: "publisher2", link: "linkyyyy" },
  { publisher: "publisher2", link: "linkyyyy" },
  { publisher: "publisher2", link: "linkyyyy" },
  { publisher: "publisher3", link: "linkyyyy" },
  { publisher: "publisher4", link: "linkyyyy" },
  { publisher: "publisher4", link: "linkyyyy" },
  { publisher: "publisher5", link: "linkyyyy" },
  { publisher: "publisher5", link: "linkyyyy" },
];

describe("build a message string", () => {
  test("it should work", () => {
    const sortedLinks = sortLinks(links);
    const res = buildMessage(sortedLinks);
    console.log("resssss", res);
  });
});
