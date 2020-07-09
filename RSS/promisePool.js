const PromisePool = require("es6-promise-pool");

const promisePool = (arr, makePromise) => {
  return new Promise((resolve, reject) => {
    const promiseProducer = function () {
      // Your code goes here.
      // If there is work left to be done, return the next work item as a promise.
      // Otherwise, return null to indicate that all promises have been created.
      // Scroll down for an example.

      while (arr.length) {
        let data = arr.pop();
        return makePromise(data);
      }
    };

    // The number of promises to process simultaneously.
    const concurrency = 3;

    // Create a pool.
    const pool = new PromisePool(promiseProducer, concurrency);

    let data = [];

    pool.addEventListener("fulfilled", function (event) {
      // console.log("boom! promised fulfilled");
      data.push(event.data.result);
    });

    pool.addEventListener("rejected", function (event) {
      // The event contains:
      // - target:    the PromisePool itself
      // - data:
      //   - promise: the Promise that got rejected
      //   - error:   the Error for the rejection
      console.log("Rejected: " + event.data.error.message);
    });
    // .then((event) => {
    //   console.log("All promises fulfilled");
    //   console.log(event.data);
    //   resolve();
    // }).catch((error) => {
    //   console.log("Some promise rejected: " + error);
    //   reject();
    // });
    pool.start().then(() => {
      resolve(data);
    });
  });
};

module.exports = promisePool;
