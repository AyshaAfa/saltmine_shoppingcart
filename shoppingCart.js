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
