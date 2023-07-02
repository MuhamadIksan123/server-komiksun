const Payment = require('../../api/v1/payment/model');
const { checkingImage } = require('./images');

const { NotFoundError, BadRequestError } = require('../../errors');

const getAllPayment = async (req) => {
  let condition = { vendor: req.user.userId };

  const result = await Payment.find(condition)
    .populate({
      path: 'image',
      select: '_id nama',
    })
    .select('_id type nomor status image');

  return result;
};

const createPayment = async (req) => {
  const { type, image, nomor } = req.body;

  await checkingImage(image);

  const check = await Payment.findOne({ type, vendor: req.user.userId });

  if (check) throw new BadRequestError('Tipe pembayaran duplikat');

  const result = await Payment.create({
    image,
    type,
    nomor,
    vendor: req.user.userId,
  });

  return result;
};

const getOnePayment = async (req) => {
  const { id } = req.params;

  const result = await Payment.findOne({
    _id: id,
    vendor: req.user.userId,
  })
    .populate({
      path: 'image',
      select: '_id nama',
    })
    .select('_id type nomor status image');

  if (!result)
    throw new NotFoundError(`Tidak ada tipe pembayaran dengan id :  ${id}`);

  return result;
};

const updatePayment = async (req) => {
  const { id } = req.params;
  const { type, image, nomor } = req.body;

  await checkingImage(image);

  const check = await Payment.findOne({
    type,
    _id: { $ne: id },
    vendor: req.user.userId,
  });

  if (check) throw new BadRequestError('Tipe pembayaran duplikat');

  const result = await Payment.findOneAndUpdate(
    { _id: id },
    { type, image, nomor },
    { new: true, runValidators: true }
  );

  if (!result)
    throw new NotFoundError(`Tidak ada tipe pembayaran dengan id :  ${id}`);

  return result;
};

const deletePayment = async (req) => {
  const { id } = req.params;

  const result = await Payment.findOneAndRemove({
    _id: id,
    vendor: req.user.userId,
  });

  if (!result)
    throw new NotFoundError(`Tidak ada tipe pembayaran dengan id :  ${id}`);

  return result;
};

const checkingPayment = async (id) => {
  const result = await Payment.findOne({ _id: id });

  if (!result)
    throw new NotFoundError(`Tidak ada tipe pembayaran dengan id :  ${id}`);

  return result;
};

module.exports = {
  getAllPayment,
  createPayment,
  getOnePayment,
  updatePayment,
  deletePayment,
  checkingPayment,
};
