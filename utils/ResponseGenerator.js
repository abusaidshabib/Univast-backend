class ResponseGenerator {
  static send(res, result) {
    if (Array.isArray(result)) {
      res.json({
        status: true,
        message: "Successful",
        length: result.length,
        data: result,
      });
    } else {
      res.json({
        status: false,
        message: "Some kind of duplicate data or another error happened",
        data: result,
      });
    }
  }
}

module.exports = ResponseGenerator;
