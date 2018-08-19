/*
Pack a list of orders into vans.
Put all of the orders for the same customer into the same van if possible.
Vans have a maximum weight capacity of 5.
*/

/* Iteration #1: 
Priorities/Limitations:
- Pack orders from same customer Id into same van (as much as possible)
- Maximum van capacity = 5

Steps
- Loop through all orders and find customer Ids with more than one order (with ones with most orders first)
- Group these orders by customerId
- Insert these orders into vans (max van capacity = 5)
- After that, insert remaining orders into vans with spare capacity first and then to new vans
- For vans with orders from the same customer Ids, specify them 
*/

function packAndReport(orders) {
  // Quick format check for orders
  const orderCheck =
    Array.isArray(orders) &&
    orders.every(order => typeof order === 'object') &&
    orders.every(
      order =>
        Object.keys(order).includes('customerId') &&
        Object.keys(order).includes('orderId') &&
        Object.keys(order).includes('weight') &&
        Object.keys(order).length === 3
    );
  if (!orderCheck) {
    throw new Error('Order format is incorrect. Please check.');
  }

  // Reformat orderList to packingSheet to group orders by customerId
  const orderCustomerId = orders.map(order => order.customerId);
  const uniqueCustomerId = Array.from(new Set(orderCustomerId));

  const packingSheet = uniqueCustomerId
    .map(customerId => {
      let count = 0;
      const custOrders = [];
      for (let i = 0; i < orderCustomerId.length; i++) {
        orders[i].customerId === customerId &&
          custOrders.push({
            orderId: orders[i].orderId,
            weight: orders[i].weight,
            customerId,
          });
        orderCustomerId[i] === customerId && count++;
      }
      return {
        customerId,
        count,
        custOrders,
      };
    })
    .sort((a, b) => {
      return b.count - a.count;
    });

  /*
  examplePackingSheet = [
    {
      customerId: 'abc',
      orderCount: 3,
      custOrders: [
        {
          orderId: '123',
          weight: 2
        },
        {
          orderId: '111',
          weight: 2
        }
      ]
    }
  ]
  */

  const ordersToPack = [].concat(
    ...packingSheet.map(order => order.custOrders)
  );

  const vanCapacity = 5;
  const vanPackingOrder = [];

  const insertOrderToVan = order => {
    // Initialize van packing order
    vanPackingOrder.length === 0 &&
      vanPackingOrder.push({ vanId: 1, orders: [] });
    const numberOfVan = vanPackingOrder.length;

    // Loop through each van and check if there is capacity to take on order
    // Otherwise, add additional van
    for (let j = 0; j < numberOfVan; j++) {
      const vanOrders = vanPackingOrder[j].orders;
      const vanUsedCapacity =
        vanOrders.length > 0
          ? vanOrders.map(order => order.weight).reduce((a, b) => a + b, 0)
          : 0;
      const vanRemainingCapacity = vanCapacity - vanUsedCapacity;

      if (order.weight <= vanRemainingCapacity) {
        vanOrders.push(order);
        return;
      } else if (j === numberOfVan - 1) {
        vanPackingOrder.push({ vanId: numberOfVan + 1, orders: [] });
        const newVan = vanPackingOrder[numberOfVan];
        newVan.orders.push(order);
        return;
      }
    }
  };

  for (let i = 0; i < ordersToPack.length; i++) {
    insertOrderToVan(ordersToPack[i]);
  }

  let vanWithSameCustOrder = [];
  const custGroup = vanPackingOrder.map((_, i) => {
    return vanPackingOrder[i].orders.map(order => order.customerId);
  });
  uniqueCustomerId.map(cust => {
    const vans = [];
    for (let i = 0; i < custGroup.length; i++) {
      if (custGroup[i].includes(cust)) {
        vans.push(i + 1);
      }
      vans.length > 1 && vanWithSameCustOrder.push(...vans);
    }
  });

  const report = {
    van: vanPackingOrder,
    spreadVanIds: Array.from(new Set(vanWithSameCustOrder)).sort(
      (a, b) => a - b
    ),
  };

  return report;
}

module.exports = packAndReport;
