import client from "./client";

const db = "users";
const collection = "data";

export default {
  // TODO{Dee.C}: Add JSDocs style comments for API documentation
  async findAllArtists() {
    try {
      const cursor = await client
        .db(db)
        .collection(collection)
        // `find` with no args means everything
        .find();

      // `await` is on receiver - no need here
      return cursor.toArray();
    } catch (error) {
      throw new Error(error);
    }
  },

  async findInvestor(investor) {
    try {
      return client
        .db(db)
        .collection(collection)
        .findOne({ "investors.email": investor });
    } catch (error) {
      throw new Error(error);
    }
  },

  // TODO: Consider updating these to use Mongo ids instead of names

  /**
   * Add a new investment
   * @param {string} investment
   * @returns {Object}
   */
  addInvestment(investment) {
    try {
      return client
        .db(db)
        .collection(collection)
        .insertOne({ name: investment });
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Update an investment
   * @param {investment} investment name
   * @param {Object} payload
   * @returns {Object}
   */
  updateInvestmentButNotInvestors(investment, payload) {
    try {
      return client
        .db(db)
        .collection(collection)
        .updateOne({ name: investment }, { $set: payload });
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Add an investor to an investment
   * @param {string} investment - `name`
   * @param {Object} investor
   * @returns {Object}
   */
  addInvestorToInvestment(investment, investor) {
    try {
      return (
        client
          .db(db)
          .collection(collection)

          // Update an investment that has a `name` of `investment` by pushing `investor`
          .updateOne({ name: investment }, { $push: { investors: investor } })
      );
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Add an investor to an investment
   * @param {string} investor - ✉️
   * @param {Object} payload - existing and new information from request
   * @returns {Object}
   */
  updateInvestorInfo(investor, payload) {
    try {
      return client
        .db(db)
        .collection(collection)
        .updateMany(
          // 'find' all matching investments
          { "investors.email": investor },
          {
            $set: {
              // `$` represents the index of the correct item in the array
              "investors.$": payload,
            },
          }
        );
    } catch (error) {
      throw new Error(error);
    }
  },

  deleteInvestment(investment) {
    try {
      return client
        .db(db)
        .collection(collection)
        .deleteOne({ name: investment });
    } catch (error) {
      throw new Error(error);
    }
  },
};
