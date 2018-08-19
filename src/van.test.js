const packAndReport = require('./van');
const Factory = require('./setup/factory');

describe('Testing packAndReport function', () => {
  describe('Testing handling of inputs', () => {
    const badInput = [
      [1, 2, 3, 4],
      'abc',
      [
        Factory.build(),
        {
          customerId: 'abc',
          orderId: 'xyz',
        },
      ],
      [
        {
          nameId: 'abc',
          customerId: 'abc',
          orderId: 'xyz',
          weight: 3,
        },
      ],
    ];
    badInput.forEach((bad, i) => {
      it(`Sample #${i +
        1} should throw an error stating wrong input format`, () => {
        expect(() => packAndReport(bad)).toThrow();
      });
    });
  });

  // 20 exampleOrders in each of 20 test cases
  const numOfTestCases = 20;
  const testCases = [];
  const numOfExampleOrders = 20;

  for (let i = 0; i < numOfTestCases; i++) {
    const exampleOrders = [];
    for (let j = 0; j < numOfExampleOrders; j++) {
      exampleOrders.push(Factory.build());
    }
    testCases.push(exampleOrders);
  }

  for (let i = 0; i < testCases.length; i++) {
    describe(`Test Case #${i + 1}: Check if output match expectation`, () => {
      const vanPackingReport = packAndReport(testCases[i]);
      const vanPackingSheet = vanPackingReport.van;

      it('should use the right number of van', () => {
        const totalOrderWeight = testCases[i].reduce((a, b) => a + b.weight, 0);
        const totalVanOrderCapacity = vanPackingSheet
          .map(van => van.orders.map(order => order.weight))
          .reduce((a, b) => a + b.reduce((a, b) => a + b, 0), 0);

        expect(totalVanOrderCapacity).toEqual(totalOrderWeight);
        expect(vanPackingSheet.length).toBeLessThan(numOfExampleOrders);
        expect(vanPackingSheet.length).toBeGreaterThan(numOfExampleOrders / 5);
      });

      it('should show the van ids with orders from same customer', () => {
        const minVan = numOfExampleOrders / vanPackingSheet.length;
        expect(vanPackingReport.spreadVanIds.length).toBeLessThanOrEqual(
          numOfExampleOrders
        );
        expect(vanPackingReport.spreadVanIds.length).toBeGreaterThan(minVan);
      });
    });
  }
});
