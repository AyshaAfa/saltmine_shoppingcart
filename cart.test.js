const { addToCart, getAllProducts, taxCalculation, grandTotal } = require("./shoppingCart")
const fetch = require("node-fetch");
jest.mock("node-fetch", () => jest.fn());

const mockProducts = [
  { title: "Cheerios", price: 8.43 },
  { title: "Cornflakes", price: 4.99 },
  { title: "Frosties", price: 5.99 },
  { title: "Shreddies", price: 6.49 },
  { title: "Weetabix", price: 7.29 },
];

describe("Shopping Cart Functions", () => {
  beforeEach(() => {
    fetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(mockProducts) });
  });

  test("getAllProducts should fetch and return product list", async () => {
    const products = await getAllProducts();
    expect(products).toEqual(mockProducts);
  });

  test("taxCalculation should return correct tax amount", async () => {
    const tax = await taxCalculation(100);
    expect(tax).toBe(12.5);
  });

  test("grandTotal should return correct total amount including tax", async () => {
    const total = await grandTotal(100);
    expect(total).toBe(112.5);
  });

  test("addToCart should calculate the total correctly", async () => {
    const cart = [
      { products: "Cheerios", quantities: 2 },
      { products: "Cornflakes", quantities: 3 },
    ];

    console.log = jest.fn(); // Mock console.log to prevent actual logging
    await addToCart(cart);

    expect(console.log).toHaveBeenCalledWith("cart contains 2 x Cheerios");
    expect(console.log).toHaveBeenCalledWith("cart contains 3 x Cornflakes");
  });
});
