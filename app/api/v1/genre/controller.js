// import services genre
const {
    getAllGenre,
    getOneGenre,
    createGenre,
    updateGenre,
    deleteGenre
} = require('../../../services/mongoose/genre');

const { StatusCodes } = require('http-status-codes');



// buat function create
const create = async (req, res, next) => {
    try {        
        const result = await createGenre(req);

        res.status(StatusCodes.CREATED).json({
            data: result
        })
    } catch (err) {
        next(err);
    }
}

const index = async (req, res, next) => {
    try {
        const result = await getAllGenre();
        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
}

const find = async (req, res, next) => {
  try {
    const result = await getOneGenre(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await updateGenre(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deleteGenre(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
    create,
    index,
    find,
    update,
    destroy
}