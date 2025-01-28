import '/js/components/componentAddProduct.js';

// Función para generar un ID único para el recibo basado en la fecha y hora
function generateReceiptID() {
  const now = new Date();
  
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${day}${month}${year}${hours}${minutes}${seconds}`;
}

// Objeto para almacenar los recibos y productos
let receiptData = {};

// Función para agregar productos al recibo
function addProductToReceipt(product) {
  const receiptID = generateReceiptID();

  if (!receiptData[receiptID]) {
    receiptData[receiptID] = {
      header: {
        storeName: "Mi Tienda",
        receiptDate: new Date().toLocaleString(),
        cashier: "Juan Pérez",
      },
      products: [],
      summary: {
        subTotal: 0,
        iva: 0,
        total: 0,
      },
    };
  }

  receiptData[receiptID].products.push(product);
  updateTotals();  // Llamamos a la función para actualizar los totales
}

// Función para eliminar un producto del recibo
function removeProductFromReceipt(product) {
  for (let receiptID in receiptData) {
    const index = receiptData[receiptID].products.findIndex(p => p.codigoProd === product.codigoProd);
    if (index !== -1) {
      receiptData[receiptID].products.splice(index, 1);
      break;
    }
  }
  updateTotals();  // Llamamos a la función para actualizar los totales
}

// Función para actualizar los totales (subtotal, iva, total)
function updateTotals() {
  const receiptID = Object.keys(receiptData)[Object.keys(receiptData).length - 1];
  const receipt = receiptData[receiptID];

  let subTotal = 0;
  receipt.products.forEach(product => {
    subTotal += product.subTotal;
  });

  const iva = subTotal * 0.19;  // Calcular el IVA (19%)
  const total = subTotal + iva;

  // Actualizamos los totales en el objeto receipt
  receipt.summary.subTotal = subTotal;
  receipt.summary.iva = iva;
  receipt.summary.total = total;

  // Actualizamos los valores en el HTML
  document.getElementById("subtotal").textContent = subTotal.toFixed(2);
  document.getElementById("iva").textContent = iva.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
}

// Manejo del evento 'submit' del formulario de producto
const myFormProduct = document.getElementById("formProduct");

myFormProduct.addEventListener("submit", function(e) {
  e.preventDefault();

  // Obtener los datos del formulario
  const data = new FormData(e.target);
  const product = {
    codigoProd: data.get("codigoProd"),
    nombreProd: data.get("nombreProd"),
    valor: parseFloat(data.get("valor")),
    cantidad: parseInt(data.get("cantidad")),
    subTotal: parseFloat(data.get("valor")) * parseInt(data.get("cantidad")),
  };

  // Agregar el producto al recibo
  addProductToReceipt(product);

  // Crear una fila en la tabla con los datos del producto
  const myTable = document.getElementById("table").getElementsByTagName('tbody')[0];
  const newRow = myTable.insertRow();
  newRow.innerHTML = `
    <td>${product.codigoProd}</td>
    <td>${product.nombreProd}</td>
    <td>${product.valor}</td>
    <td>${product.cantidad}</td>
    <td class="subTotal">${product.subTotal}</td>
    <td><button class="deleteButton">X</button></td>
  `;

  // Botón para eliminar el producto de la tabla y los totales
  newRow.querySelector(".deleteButton").addEventListener("click", function() {
    myTable.deleteRow(newRow.rowIndex);  // Eliminar la fila de la tabla
    removeProductFromReceipt(product);   // Eliminar el producto del recibo
  });
});

// Función para actualizar los totales cuando el usuario haga clic en "Pagar"
document.getElementById("payButton").addEventListener("click", function() {
  const receiptID = Object.keys(receiptData)[Object.keys(receiptData).length - 1];
  const receipt = receiptData[receiptID];

  const subTotal = receipt.summary.subTotal;
  const iva = receipt.summary.iva;
  const total = receipt.summary.total;

  alert(`Recibo ${receiptID}:
  \nSubtotal: $${subTotal.toFixed(2)}
  \nIVA (19%): $${iva.toFixed(2)}
  \nTotal: $${total.toFixed(2)}
  \nProductos: \n${receipt.products.map(p => `${p.nombreProd} - $${p.subTotal.toFixed(2)}`).join("\n")}`);
  location.reload();
});
