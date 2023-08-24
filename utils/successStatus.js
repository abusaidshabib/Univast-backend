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

exports.serverNOTdeclared = (res) => {
  res.status(204).json({
    status: "success",
    message: "server is ok but, we don't work with this",
  });
};
