function paginate(req) {
  let { page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  if (limit > 100) limit = 100;

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

module.exports = paginate;
