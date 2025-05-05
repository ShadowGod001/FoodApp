import React, { useState, useEffect } from "react";
import "./App.css";
import Receipt from "./components/receipt";
import FoodContainer from "./components/foodContainer";
import Header from "./components/header";

/*
const comidas = [
  { id: "1", img: "🍔", name: "Hamburguesa", price: 157, stock: 0 },
  { id: "2", img: "🍕", name: "Pizza", price: 189, stock: 9 },
  { id: "3", img: "🍣", name: "Sushi", price: 132, stock: 6 },
  { id: "4", img: "🌮", name: "Taco", price: 175, stock: 2 },
  { id: "5", img: "🥗", name: "Ensalada", price: 108, stock: 7 },
  { id: "6", img: "🍜", name: "Ramen", price: 198, stock: 3 },
  { id: "7", img: "🍩", name: "Dona", price: 123, stock: 5 },
  { id: "8", img: "🥪", name: "Sándwich", price: 144, stock: 1 },
  { id: "9", img: "🥞", name: "Panqueques", price: 160, stock: 8 },
  { id: "10", img: "🍟", name: "Papas fritas", price: 116, stock: 6 }
];
*/
function App() {

  // Orders contendrá los pedidos que se vayan haciendo. setOrders se usa para actualizar el estado de orders.
  const [orders, setOrders] = useState([]); //Creo una variable de estado orders, que empieza como un array vacío.
  // const [stock, setStock] = useState([]);
  const [comidas, setComidas] = useState([]);

  const fetchComidas = () => { //Get comidas
    fetch("http://localhost:3000/comidas")
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener comidas");
        return res.json();
      })
      .then(data => setComidas(data))
      .catch(err => console.error("Error al cargar comidas:", err));
  };
  

  useEffect(() => { //Se ejecuta despues del renderizado del componente. Se usa para hacer peticiones a la API.
    fetchComidas();
  }, []);
  
  //Función que añade un item al array de orders. Item es el objeto que contiene la información del pedido.
  const addOrder = (item) => {
    console.log("[addOrder] llamado con:", item);
    const comida = comidas.find(c => c.id === item.id); // Encuentra la comida en el array de comidas.
    if (comida && comida.stock > 0) { // Si la comida existe y hay stock.
      const existingOrder = orders.find(order => order.id === item.id); //Busca si hay una orden del mismo tipo en la lista de orders
      if (existingOrder) {
        console.log("[addOrder] Ya existe la orden, aumentando cantidad.");
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === item.id ? { ...order, quantity: order.quantity + 1 } : order //Copio el objeto order y le sumo 1 a la cantidad. Esto no muta el estado porque crea un nuevo objeto.
          )
        );
      } else {
        console.log("[addOrder] Orden nueva, agregando al estado.");
        setOrders(prevOrders => [...prevOrders, { ...item, quantity: 1 }]);  //Si no existe agrego como nuevo con quantity = 1
      }
    } else {
      console.warn("[addOrder] Stock insuficiente para:", item.name);
      alert("Stock insuficiente");
    }
  };
 
  //Función que elimina un item del array de orders. Index es el índice del item a eliminar.
  const removeOrder = (index) => {
    const newOrders = [...orders];
    newOrders.splice(index, 1); //Elimina el item en la posición index del array de orders.
    setOrders(newOrders);
  };
  
//Función que le resta 1 a la cantidad de un item en orders. Index es el índice del item a eliminar.
const removeOneOrder = (index) => {
  const newOrders = [...orders];
  const item = newOrders[index];

  if (item.quantity > 1) {
    newOrders[index] = {
      ...item,
      quantity: item.quantity - 1
    };
  } else {
    newOrders.splice(index, 1);
  }
  setOrders(newOrders);
};

//Función que actualiza el stock de una comida. Id es el id de la comida y newStock es el nuevo stock.
const updateStock = (id, newStock) => {
  fetch(`http://localhost:3000/comidas/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ stock: newStock })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al actualizar el stock');
      }
      return response.json();
    })
    .then(updatedComida => {
      setComidas(prevComidas =>
        prevComidas.map(comida =>
          comida.id === id ? { ...comida, stock: updatedComida.stock } : comida //Actualizo el stock de la comida en el array de comidas. Si la comida es la misma que la que le paso, creo una copia y le actualizo el stock. Si no, lo dejo igual.
        )
      );
    })
    .catch(error => console.error('Error updating stock:', error));
};

//Función que se llama al finalizar la compra. Recorre el array de orders y le resta la cantidad de cada comida al stock. Luego limpia el array de orders.
const finalizarCompra = () => {
  const updates = orders.map(order => {
    const comida = comidas.find(c => c.id === order.id);
    const nuevoStock = comida.stock - order.quantity;

    return fetch(`http://localhost:3000/comidas/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: nuevoStock }),
    });
  });

  Promise.all(updates)
    .then(() => {
      fetchComidas(); // Actualiza la lista de comidas después de la compra
      setOrders([]); // Limpia el array de orders después de la compra
    })
    .catch(err => {
      console.error("Error al finalizar compra:", err);
    });
};

  return (
    <>
      <Header />
      <div className="container">
        <div className="food-container">
          <FoodContainer
            addOrder={addOrder}
            comidas={comidas}
            orders={orders}
          />{" "}
          {/*Componente que contiene la lista de comidas. Se le pasa la función addOrder como prop para que pueda añadir pedidos.*/}
        </div>
        <div className="receipt-container">
          <Receipt
            comidas={comidas}
            orders={orders}
            removeOrder={removeOrder}
            removeOneOrder={removeOneOrder}
            addOrder={addOrder}
            finalizarCompra={finalizarCompra}
          />{" "}
          {/*Componente que contiene el ticket. Se le pasa la variable orders como prop para que pueda mostrar los pedidos y la función removeOrder para que pueda eliminar pedidos.*/}
        </div>
      </div>
    </>
  );
}

export default App;
