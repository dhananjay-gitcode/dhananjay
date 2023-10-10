import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import "./Table.css";
import Navbar from "./Navbar";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function OrderList() {
  const fetch = useAuthenticatedFetch();
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState([]);
  const [product, setProduct] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3009/orders");
      setOrders(response.data);
    }
    fetchData();
    // handlePostOrder();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/orders");
        const jsonData = await response.json();
        setOrder(jsonData.data);
        console.log(jsonData, "orders from fetch data");
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    // handlePostOrder();
  }, []);

  // const handlePostOrder = async () => {
  //   try {
  //     const response = await fetch("/api/order");
  //     const jsonData = await response.json();
  //     setOrder(jsonData.data);
  //     console.log(jsonData, "order data");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  //   const { data } = useAppQuery({
  //   url: "/api/order",
  //   reactQueryOptions: {
  //     onSuccess: () => {
  //       setOrder(data.data);
  //       console.log(" CLI",data.data);
  //     },
  //   },
  // });

  return (
    <>
      <Navbar />
      <h1>Admin store data</h1>
      <table id="customers" style={{ float: "left", width: "50%" }}>
        <thead>
          <tr>
            <th>ID</th>
            {/* <th>Name</th> */}
            <th>Order Number</th>
            <th>Email</th>
            {/* <th>Phone</th> */}
            <th>Total price</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map((or) => (
              <tr key={or.id}>
                <td>{or.id}</td>
                {/* <td>{or.customer.first_name}</td> */}
                <td>{or.name}</td>
                <td>{or.contact_email}</td>
                {/* <td>{or.customer.phone}</td> */}
                <td>{or.current_subtotal_price}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h1>Merchant store data</h1>
      <table id="customers" style={{ float: "right", width: "50%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>APP ID</th>
          </tr>
        </thead>
        <tbody>
          {order &&
            order.map((op) => (
              <tr key={op.id}>
                <td>{op.id}</td>
                <td>{op.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default OrderList;
