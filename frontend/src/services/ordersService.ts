/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from "./api";
import { Order } from "../types";

export const ordersService = {
  checkout: async (address: string): Promise<{ success: boolean; message: string; order?: Order }> => {
    const response = await api.post("/checkout", { address });
    return response.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await api.get("/orders");
    return response.data;
  }
};
