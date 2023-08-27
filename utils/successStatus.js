exports.dataGetResponse = (res, data) => {
  res.status(200).json({
    status: "successfully get data",
    data: {
      data,
    },
  });
};

exports.sendCreatedResponse = (res, data) => {
  res.status(201).json({
    status: "successfully created data",
    data: {
      data,
    },
  });
};

exports.sendUpdatedResponse = (res, data) => {
  res.status(201).json({
    status: "successfully updated data",
    data: {
      data,
    },
  });
};

exports.serverNOTdeclared = (res) => {
  res.status(204).json({
    status: "success",
    message: "server is ok but, we don't work with this",
  });
};

exports.customResponse = (res, statusCode, data, message) => {
  const status = `${statusCode}`.startsWith("4") ? "fail" : "success";

  res.status(statusCode).json({
    status: status,
    message: message,
    data: data,
  });
};
