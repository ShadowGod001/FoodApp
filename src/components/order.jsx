import React from "react";
import "./order.css";

function Order({
  order,
  index,
  removeOrder,
  removeOneOrder,
  addOrder,
  comida
}) {
  return (
    <div key={index} className="order-item">
      <span>
        {order.img} x {order.quantity}
      </span>
      <span>${order.price * order.quantity}</span>
      <button onClick={() => removeOneOrder(index)}>➖</button>
      <button
       onClick={() => {
        console.log("[Order] ➕ clickeado:", order.name);
        addOrder(comida);
      }}
        //onClick={() => addOrder(comida)}
        disabled={comida.stock - order.quantity === 0}
      >
        ➕
      </button>
      <button onClick={() => removeOrder(index)}>❌</button>
    </div>
  );
}

export default Order;
