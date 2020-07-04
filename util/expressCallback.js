module.exports = (controller) => {
  return async (req, res) => {
    const httpRequest = {
      user: req.user,
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        "Content-Type": req.get("Content-Type"),
        Referer: req.get("referer"),
        "User-Agent": req.get("User-Agent"),
      },
    };
    controller(httpRequest)
      .then((httpResponse) => {
        if (httpResponse.headers) {
          res.set(httpResponse.headers);
        }
        if (httpResponse.cookie) {
          res.cookie("token", httpResponse.cookie);
        }
        if (httpResponse.clearCookie) {
          res.clearCookie("token");
        }
        res.status(httpResponse.statusCode).json(httpResponse.body);
      })
      .catch((err) => {
        console.log("express callback error: ");
        res.status(500).send({ errors: [err] });
      });
  };
};
