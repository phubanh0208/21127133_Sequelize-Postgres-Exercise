const controller = {};
const models = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;

controller.showList = async (req, res) => {
  let category = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
  res.locals.categories = await models.Category.findAll({
    include: [
      {
        model: models.Blog,
      },
    ],
  });

  let tag = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);

  let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));

  let keyword = req.query.keyword || "";

  let options = {
    attributes: ["id", "title", "imagePath", "summary", "createdAt"],
    include: [{ model: models.Comment }],
    where: {},
  };

  if (category > 0) {
    options.where.categoryId = category;
  }

  if (tag > 0) {
    options.include = [
      {
        model: models.Tag,
        where: { id: tag },
      },
    ];
  }

  if (keyword.trim() != "") {
    options.where.title = {
      [Op.iLike]: `%${keyword}%`,
    };
  }

  const productLimit = 2;
  options.limit = productLimit;
  options.offset = productLimit * (page - 1);

  let { rows, count } = await models.Blog.findAndCountAll(options);
  res.locals.pagination = {
    page: page,
    limit: productLimit,
    totalRows: count,
    queryParams: req.query,
  };

  res.locals.blogs = rows;
  res.locals.tags = await models.Tag.findAll();
  res.render("index");
};

controller.showDetails = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);

  res.locals.tags = await models.Tag.findAll();

  res.locals.categories = await models.Category.findAll({
    include: [
      {
        model: models.Blog,
      },
    ],
  });

  res.locals.blog = await models.Blog.findOne({
    attributes: ["id", "title", "description", "createdAt"],
    where: { id: id },
    include: [
      { model: models.Category },
      { model: models.User },
      { model: models.Tag },
      { model: models.Comment },
    ],
  });
  res.render("details");
};
module.exports = controller;
