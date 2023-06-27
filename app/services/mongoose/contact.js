// import model contact
const Contact = require("../../api/v1/contact/model");

// import custom error not found dan bad request
const { NotFoundError, BadRequestError } = require("../../errors");

const getAllContact = async (req) => {
  const { limit = 10, page = 1, startDate, endDate } = req.query;
  let condition = {};

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);
    condition = {
      ...condition,
      date: {
        $gte: start,
        $lt: end,
      },
    };
  }

  const result = await Contact.find(condition)
    .limit(limit)
    .skip(limit * (page - 1));

  const count = await Contact.countDocuments(condition);
  return { data: result, pages: Math.ceil(count / limit), total: count };
};

const createContact = async (req) => {
  const { nama, email, isiPesan, date } = req.body;

  const result = await Contact.create({ nama, email, isiPesan, date });

  return result;
};

const getOneContact = async (req) => {
  const { id } = req.params;
  const result = await Contact.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada contact dengan id : ${id}`);

  return result;
};

const deleteContact = async (req) => {
  const { id } = req.params;
  const result = await Contact.findOneAndDelete({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada contact dengan id : ${id}`);

  return result;
};

module.exports = {
    getAllContact,
    createContact,
    getOneContact,
    deleteContact,
}