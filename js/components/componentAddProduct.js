class ComponentAddProduct extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML= `<form id="formProduct">
        <div class="form-group">
          <label for="codigoProd">Código del Producto</label>
          <input type="number" class="form-control" name="codigoProd" id="codigoProd">
      </div>
      <div class="form-group">
          <label for="nombreProd">Nombre del Producto</label>
          <input type="text" class="form-control" name="nombreProd" id="nombreProd">
      </div>
      <div class="form-group">
          <label for="valor">Valor Unitario</label>
          <input type="number" class="form-control" name="valor" id="valor">
      </div>
      <div class="form-group">
          <label for="cantidad">Cantidad</label>
          <input type="number" class="form-control" name="cantidad" id="cantidad">
      </div>
      <button class="btn btn-primary">Añadir Producto</button>
      </form>`;
    }
}
customElements.define('product-component', ComponentAddProduct)

