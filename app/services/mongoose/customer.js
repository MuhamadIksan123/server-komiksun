// const User = require("../../api/v1/user/model");
// const Komik = require("../../api/v1/events/model");
// // const Orders = require("../../api/v1/orders/model");
// const Payments = require("../../api/v1/payments/model");

// // const {
// //   BadRequestError,
// //   NotFoundError,
// //   UnauthorizedError,
// // } = require("../../errors");
// // const { createTokenUser, createJWT } = require("../../utils");

// const { otpMail } = require("../mail");

// const signupUser = async (req) => {
//   const {
//     nama,
//     password,
//     role,
//     email,
//     lahir,
//     status,
//     otp,
//     sampul,
//     profile,
//     komik,
//   } = req.body;

//   // jika email dan status tidak aktif
//   let result = await User.findOne({
//     email,
//     status: "tidak aktif",
//   });

//   if (result) {
//     result.nama = nama;
//     result.role = role;
//     result.email = email;
//     result.password = password;
//     result.lahir = lahir;
//     result.sampul = sampul;
//     result.profile = profile;
//     result.komik = komik;
//     result.otp = Math.floor(Math.random() * 9999);
//     await result.save();
//   } else {
//     result = await User.create({
//       nama,
//       password,
//       role,
//       email,
//       lahir,
//       sampul,
//       profile,
//       komik,
//       otp: Math.floor(Math.random() * 9999),
//     });
//   }
//   await otpMail(email, result);

//   delete result._doc.password;
//   delete result._doc.otp;

//   return result;
// };

// const activateUser = async (req) => {
//   const { otp, email } = req.body;
//   const check = await User.findOne({
//     email,
//   });

//   if (!check) throw new NotFoundError("Partisipan belum terdaftar");

//   if (check && check.otp !== otp) throw new BadRequestError("Kode otp salah");

//   const result = await User.findByIdAndUpdate(
//     check._id,
//     {
//       status: "aktif",
//     },
//     { new: true }
//   );

//   delete result._doc.password;

//   return result;
// };

// const signinUser = async (req) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     throw new BadRequestError("Please provide email and password");
//   }

//   const result = await User.findOne({ email: email });

//   if (!result) {
//     throw new UnauthorizedError("Invalid Credentials");
//   }

//   if (result.status === "tidak aktif") {
//     throw new UnauthorizedError("Akun anda belum aktif");
//   }

//   const isPasswordCorrect = await result.comparePassword(password);

//   if (!isPasswordCorrect) {
//     throw new UnauthorizedError("Invalid Credentials");
//   }

//   const token = createJWT({ payload: createTokenUser(result) });

//   return token;
// };

// // const getAllEvents = async (req) => {
// //   const result = await Events.find({ statusEvent: "Published" })
// //     .populate("category")
// //     .populate("image")
// //     .select("_id title date tickets venueName");

// //   return result;
// // };

// // const getOneEvent = async (req) => {
// //   const { id } = req.params;
// //   const result = await Events.findOne({ _id: id })
// //     .populate("category")
// //     .populate({ path: "talent", populate: "image" })
// //     .populate("image");

// //   if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

// //   return result;
// // };

// // const getAllOrders = async (req) => {
// //   console.log(req.participant);
// //   const result = await Orders.find({ participant: req.participant.id });
// //   return result;
// // };

// // /**
// //  * Tugas Send email invoice
// //  * TODO: Ambil data email dari personal detail
// //  *  */
// // const checkoutOrder = async (req) => {
// //   const { event, personalDetail, payment, tickets } = req.body;

// //   const checkingEvent = await Events.findOne({ _id: event });
// //   if (!checkingEvent) {
// //     throw new NotFoundError("Tidak ada acara dengan id : " + event);
// //   }

// //   const checkingPayment = await Payments.findOne({ _id: payment });

// //   if (!checkingPayment) {
// //     throw new NotFoundError(
// //       "Tidak ada metode pembayaran dengan id :" + payment
// //     );
// //   }

// //   let totalPay = 0,
// //     totalOrderTicket = 0;
// //   await tickets.forEach((tic) => {
// //     checkingEvent.tickets.forEach((ticket) => {
// //       if (tic.ticketCategories.type === ticket.type) {
// //         if (tic.sumTicket > ticket.stock) {
// //           throw new NotFoundError("Stock event tidak mencukupi");
// //         } else {
// //           ticket.stock -= tic.sumTicket;

// //           totalOrderTicket += tic.sumTicket;
// //           totalPay += tic.ticketCategories.price * tic.sumTicket;
// //         }
// //       }
// //     });
// //   });

// //   await checkingEvent.save();

// //   const historyEvent = {
// //     title: checkingEvent.title,
// //     date: checkingEvent.date,
// //     about: checkingEvent.about,
// //     tagline: checkingEvent.tagline,
// //     keyPoint: checkingEvent.keyPoint,
// //     venueName: checkingEvent.venueName,
// //     tickets: tickets,
// //     image: checkingEvent.image,
// //     category: checkingEvent.category,
// //     talent: checkingEvent.talent,
// //     organizer: checkingEvent.organizer,
// //   };

// //   const result = new Orders({
// //     date: new Date(),
// //     personalDetail: personalDetail,
// //     totalPay,
// //     totalOrderTicket,
// //     orderItems: tickets,
// //     participant: req.participant.id,
// //     event,
// //     historyEvent,
// //     payment,
// //   });

// //   await result.save();
// //   return result;
// // };

// // const getAllPaymentByOrganizer = async (req) => {
// //   const { organizer } = req.params;

// //   const result = await Payments.find({ organizer: organizer });

// //   return result;
// // };

// // module.exports = {
// //   signupUser,
// //   activateUser,
// //   signinUser,
// //   getAllEvents,
// //   getOneEvent,
// //   getAllOrders,
// //   checkoutOrder,
// //   getAllPaymentByOrganizer,
// // };
