class ResponseGenerator {
  constructor(res, statusCode, data) {
    let status;
    let message;

    switch (res.req.method) {
      case "GET":
        status = statusCode === 200;
        message = status ? "Data retrieved successfully" : "Data retrieval failed";
        break;
      case "POST":
        status = statusCode === 201;
        message = status ? "Data created successfully" : "Data creation failed";
        break;
      case "PATCH":
      case "PUT":
        status = statusCode === 200 || statusCode === 201;
        message = status ? "Data updated successfully" : "Data update failed";
        break;
      case "DELETE":
        status = statusCode === 204;
        message = status ? "Data deleted successfully" : "Data deletion failed";
        break;
      default:
        status = false;
        message = "Invalid method";
        break;
    }

    res.status(statusCode).json({
      status: status,
      message: message,
      length: data?.length,
      data: data,
    });
  }
}

module.exports = ResponseGenerator;
