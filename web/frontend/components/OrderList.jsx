import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import "./Table.css";

export function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3009/orders");
      setOrders(response.data);
    }
    fetchData();
  }, []);

  return (
    <>
      <table id="customers">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Order Number</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Total price</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map((or) => (
              <tr key={or.id}>
                <td>{or.id}</td>
                <td>{or.customer.first_name}</td>
                <td>{or.name}</td>
                <td>{or.contact_email}</td>
                <td>{or.customer.phone}</td>
                <td>{or.current_subtotal_price}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default OrderList;
