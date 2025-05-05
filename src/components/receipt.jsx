import React from "react";
import Order from "./order";
import "./receipt.css";

function Receipt({ orders, removeOrder, removeOneOrder, addOrder, comidas, finalizarCompra }) {
  const total = orders.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ); //Calcula el total de los pedidos sumando el precio de cada item en el array orders. acc es el acumulador que empieza en 0. item es cada objeto del array orders.
  return (
    <div>
      <h2>Receipt</h2>
      <div className="order-container">
        {orders.map((order, index) => (
          <Order
            key={index}
            order={order}
            index={index}
            removeOrder={removeOrder}
            removeOneOrder={removeOneOrder}
            addOrder={addOrder}
            comida={comidas.find((element) => element.id === order.id)}
            //finalizarCompra={finalizarCompra}
          />
        ))}
      </div>
      <h3>Total: ${total}</h3>
      <button onClick={finalizarCompra} className="finalizar-btn">Finalizar compra</button>
    </div>
  );
}

export default Receipt;
