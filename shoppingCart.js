const { notEqual } = require("assert");
const { resolve } = require("path");
const readline = require("readline");
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let cart = [];

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
}

async function taxCalculation(totalPriceWithoutTax) {
  return totalPriceWithoutTax * taxPercent;

}

async function grandTotal(totalPriceWithoutTax) {
  let taxAmount = await taxCalculation(totalPriceWithoutTax);
  return Math.round((taxAmount + totalPriceWithoutTax) * 100) / 100;
}

async function addToCart(cart) {
  try {
    let subTotal=0;
    let taxAmount=0;
    let totalAmount=0;
    let allProducts = await getAllProducts();
for(let item of cart){
    let Found = allProducts.find(
        (Products) => Products.title === item.products
      );
      let total = Found.price * item.quantities;
      let payableAmount = await grandTotal(total);
      subTotal=subTotal+total;
      let taxableAmount=await taxCalculation(total);
      taxAmount=taxAmount+taxableAmount;
      totalAmount=Math.round((totalAmount+payableAmount)*100)/100;
}
    let result={
        amountWithoutTax:Math.round((subTotal)*100)/100,
        taxCharges:Math.round((taxAmount)*100)/100,
        payableCharge:totalAmount
    };
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

