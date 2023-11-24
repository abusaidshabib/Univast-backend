class ResponseGenerator {
  constructor(res, statusCode, data, method, customMessage) {
    let status;
    let message;

    switch (method) {
      case "GET":
        if (statusCode === 200) {
          status = true;
          message = customMessage || "Data retrieved successfully";
        } else {
          status = false;
          message = customMessage || "Data retrieval failed";
        }
        break;
      case "POST":
        if (statusCode === 201) {
          status = true;
          message = customMessage || "Data created successfully";
        } else {
          status = false;
          message = customMessage || "Data creation failed";
        }
        break;
      case "PATCH":
        if (statusCode === 201) {
          status = true;
          message = customMessage || "Data specific data updated successfully";
        } else {
          status = false;
          message = customMessage || "Data update failed";
        }
        break;
      case "PUT":
        if (statusCode === 200) {
          status = true;
          message = customMessage || "Data updated successfully";
        } else {
          status = false;
          message = customMessage || "Data update failed";
        }
        break;
      case "DELETE":
        if (statusCode === 204) {
          status = true;
          message = customMessage || "Data deleted successfully";
        } else {
          status = false;
          message = customMessage || "Data deletion failed";
        }
        break;
      default:
        status = false;
        message = customMessage || "Invalid method";
        break;
    }

    res.status(statusCode).json({
      status: status,
      message: message,
      length: data.length,
      data: data,
    });
  }
}

module.exports = ResponseGenerator;
