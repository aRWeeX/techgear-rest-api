function validateId(entity = "Entity") {
  return (req, res, next) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
      return res
        .status(400)
        .json({ message: `${entity} ID must be a positive number` });
    }

    const entityKey = entity.charAt(0).toLowerCase() + entity.slice(1);
    req[`${entityKey.toLowerCase()}Id`] = id;

    next();
  };
}

module.exports = validateId;
