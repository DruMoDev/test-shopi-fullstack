import { shopify } from "../core/index.js";

const CUSTOMERS_COUNT = `{
  customersCount {
    count
  }
}`;

export const customerController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @description Retrieve a summary of the integration status
   */
  async customers(req, res) {
    try {
      const {
        locals: {
          shopify: { session },
        },
      } = res;

      const client = new shopify.api.clients.Graphql({ session });

      const {
        data: {
          customersCount: { count: customers },
        },
      } = await client.request(CUSTOMERS_COUNT);

      res.status(200).json({ customers });
    } catch (error) {
      console.error(error);

      res.status(400).send();
    }
  },
};
