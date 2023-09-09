exports.queryData = (req) => {
  const query = {};

  for (const key in req.query) {
    if (req.query.hasOwnProperty(key)) {
      query[key] = req.query[key];
    }
  }

  return query;
};
