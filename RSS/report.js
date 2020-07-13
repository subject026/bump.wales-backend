let report = { newLinks: [], feedFields: [], itemFields: [] };

const getReport = () => {
  return Object.freeze(report);
};

const collectFeedFields = (feed) => {
  Object.keys(feed).forEach((field) => {
    if (!report.feedFields.includes(field)) {
      report = {
        ...report,
        feedFields: [
          ...report.feedFields,
          field,
        ],
      };
    }
  });
};

const collectItemFields = (items) => {
  items.forEach((item) => {
    Object.keys(item).map((key) => {
      if (!report.itemFields.includes(key)) {
        report = {
          ...report,
          itemFields: [
            ...report.itemFields,
            key,
          ],
        };
      }
    });
  });
};

const addLink = ({ publisher, link }) => {
  report = {
    ...report,
    newLinks: [
      ...report.newLinks,
      {
        publisher,
        link,
      },
    ],
  };
};

module.exports = { getReport, collectFeedFields, collectItemFields, addLink };
