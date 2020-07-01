module.exports = {
  updateQueryGenerator: function (paramsJson) {
    if (!paramsJson || Object.keys(paramsJson).length == 0) return "";
    let queryString = "";
    let count = 1;
    for (var item in paramsJson) {
      queryString +=
        (count > 1 && count <= Object.keys(paramsJson).length ? " , " : "") +
        item +
        " = ? ";
      count++;
    }
    return queryString;
  },
};
