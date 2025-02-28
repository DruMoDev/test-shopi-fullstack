import { shopify } from "../core/index.js";

const ORDERS_COUNT = `{
  ordersCount(limit: 1000) {
    count
    precision
  }
}`;

export const ordersController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @description Retrieve a summary of the integration status
   */
  async orders(req, res) {
    try {
      const {
        locals: {
          shopify: { session },
        },
      } = res;

      const client = new shopify.api.clients.Graphql({ session });

      const {
        data: {
          ordersCount: { count: orders },
        },
      } = await client.request(ORDERS_COUNT);

      res.status(200).json({ orders });
    } catch (error) {
      console.error(error);

      res.status(400).send();
    }
  },
};
