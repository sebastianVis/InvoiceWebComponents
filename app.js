import '/js/components/componentAddProduct.js';
import '/js/components/componentTable.js';

// Función para generar un ID único para el recibo basado en la fecha y hora
function generateReceiptID() {
  const now = new Date();
  
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados (enero = 0)
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Crear el ID único basado en la fecha y hora
  return `${day}${month}${year}${hours}${minutes}${seconds}`;
}

// Objeto para almacenar los recibos y productos
let receiptData = {};

// Función para agregar productos al recibo
function addProductToReceipt(product) {
  const receiptID = generateReceiptID(); // Generar un ID único para cada recibo

  // Si el recibo no existe, lo creamos
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

  // Agregar el producto al array de productos
  receiptData[receiptID].products.push(product);

  // Actualizar los totales
  updateReceiptTotals(receiptID);
}

// Función para actualizar los totales del recibo
function updateReceiptTotals(receiptID) {
  let subTotal = 0;

  // Sumar los subtotales de todos los productos
  receiptData[receiptID].products.forEach(product => {
    subTotal += product.subTotal;
  });

  // Calcular IVA y total
  const iva = subTotal * 0.19; // 19% de IVA
  const total = subTotal + iva;

  // Actualizar los valores en el resumen
  receiptData[receiptID].summary.subTotal = subTotal;
  receiptData[receiptID].summary.iva = iva;
  receiptData[receiptID].summary.total = total;
}

// Manejo del evento 'submit' del formulario de producto
const myFormProduct = document.getElementById("myFormProduct");

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
    myTable.deleteRow(newRow.rowIndex); // Eliminar la fila de la tabla
    // Eliminar el producto del recibo
    removeProductFromReceipt(product);
  });
});

// Función para eliminar un producto del recibo y actualizar los totales
function removeProductFromReceipt(product) {
  // Buscar el recibo y el producto para eliminar
  for (let receiptID in receiptData) {
    const index = receiptData[receiptID].products.findIndex(p => p.codigoProd === product.codigoProd);
    if (index !== -1) {
      // Eliminar el producto y actualizar los totales
      receiptData[receiptID].products.splice(index, 1);
      updateReceiptTotals(receiptID);
      break;
    }
  }
}

// Función que se ejecuta cuando el usuario hace clic en el botón "Pagar"
document.getElementById("payButton").addEventListener("click", function() {
  const receiptID = generateReceiptID(); // Generar el ID del recibo cuando se paga

  // Aquí se generan los datos completos del recibo para mostrar en el alert
  const receipt = receiptData[receiptID] || {};

  // Generar la estructura completa para mostrar en el alert
  let receiptDetails = `Recibo ID: ${receiptID}\n`;
  receiptDetails += `Fecha: ${receipt.header.receiptDate}\n`;
  receiptDetails += `Cajero: ${receipt.header.cashier}\n\n`;

  receiptDetails += "Productos:\n";
  receipt.products.forEach(product => {
    receiptDetails += `${product.nombreProd} (Código: ${product.codigoProd}) - $${product.valor} x ${product.cantidad} = $${product.subTotal}\n`;
  });

  receiptDetails += `\nSubtotal: $${receipt.summary.subTotal.toFixed(2)}\n`;
  receiptDetails += `IVA (19%): $${receipt.summary.iva.toFixed(2)}\n`;
  receiptDetails += `Total: $${receipt.summary.total.toFixed(2)}\n`;

  // Mostrar el recibo completo en un alert
  window.alert(receiptDetails);

  // Limpiar el contenido de la tabla y los totales
  document.getElementById("table").getElementsByTagName('tbody')[0].innerHTML = '';
  document.getElementById("subtotal").textContent = '0.00';
  document.getElementById("iva").textContent = '0.00';
  document.getElementById("total").textContent = '0.00';

  // Limpiar los productos en receiptData
  receiptData = {};
});

function generateReceiptID() {
    const now = new Date();
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados (enero = 0)
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    // Crear el ID único basado en la fecha y hora
    return `${day}${month}${year}${hours}${minutes}${seconds}`;
  }