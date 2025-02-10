const readline = require("readline");
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let cart = [];//cart initialization
let taxPercent = 0.125;//tax percentage
async function getAllProducts() {
  try {
    const response = await fetch(`http://localhost:3001/products`);
    let data = await response.json();

    data = data.map(({ title, price }) => ({ title, price }));
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}//this function is used for fetching all the products from db.json

async function taxCalculation(totalPriceWithoutTax) {
  return totalPriceWithoutTax * taxPercent;
}//this function is used for calculating tax amount

async function grandTotal(totalPriceWithoutTax) {
  let taxAmount = await taxCalculation(totalPriceWithoutTax);
  return Math.round((taxAmount + totalPriceWithoutTax) * 100) / 100;
}//this function is used for calculating grand total amount

async function addToCart(cart) {
  try {
    let subTotal = 0;
    let taxAmount = 0;
    let totalAmount = 0;
    let allProducts = await getAllProducts();
    for (let item of cart) {
      let found = allProducts.find(
        (products) => products.title === item.products
      );//this variable is used for searching the products inside the function getAllProducts()
      let total = found.price * item.quantities;//this variable is used for calculating the price based on quantity
      let payableAmount = await grandTotal(total);//this variable is used for individual calculation of product
      subTotal += total;//this variable calculates the price of all products
      let taxableAmount = await taxCalculation(total);
      taxAmount += taxableAmount;//this variable calculates all the tax amount
      totalAmount = Math.round((totalAmount + payableAmount) * 100) / 100;//this variable is used to calculate subtotal and tax amount
    }

    let result = {
      amountWithoutTax: Math.round(subTotal * 100) / 100,
      taxCharges: Math.round(taxAmount * 100) / 100,
      payableCharge: totalAmount,
    };//

    for (let item of cart) {
      console.log(`cart contains ${item.quantities} x ${item.products}`);
    }
    console.log(`Subtotal = ${result.amountWithoutTax}`);
    console.log(`Tax = ${result.taxCharges}`);
    console.log(`Total = ${result.payableCharge}`);
  } catch (error) {
    console.error(error);
  }
}

function askQuantity() {
  return new Promise((resolve) => {
    r1.question("Enter the quantity: ", function handleAnswer(quantity) {
      quantity = parseInt(quantity);
      if (!isNaN(quantity) && quantity > 0) {
        resolve(quantity);
      } else {
        console.log("Invalid quantity. Enter a whole number.");
        r1.question("Enter the quantity: ", handleAnswer); // Repeats question if invalid
      }
    });
  });
}//this function is used in input()function

async function input() {
  return new Promise((resolve) => {
    r1.question("Enter the product: ", async (product) => {
      product =
        product.charAt(0).toUpperCase() + product.slice(1).toLowerCase();//the input we are entering will be modified as first character will be in uppercase and remaining characters will be in lower case
      let allProducts = await getAllProducts();
      let Found = allProducts.find((items) => items.title === product);//this variable is used for validation
      if (!Found) {
        console.log("invalid product.Please enter valid product");
        return resolve(input());
      }
      let quantity = await askQuantity();
      cart.push({ products: product, quantities: quantity });

      r1.question("Purchase completed? (yes or no): ", async (confirmation) => {
        if (confirmation.toLowerCase() === "yes") {
          r1.close();
          addToCart(cart);
        } else {
          resolve(input());
        }
      });//if the user enters yes then function will be terminated
    });
  });
}

input();//this is the entry point of code

module.exports = { addToCart, getAllProducts, taxCalculation, grandTotal };
