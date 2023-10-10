import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import "./Table.css";

export function CustomerList() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3005/customers");
      setCustomers(response.data);
    }
    fetchData();
  }, []);

  return (
    <>
      <table id="customers">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Orders</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {customers &&
            customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.first_name}</td>
                <td>{c.email}</td>
                <td>{c.default_address.country_name}</td>
                <td>{c.orders_count}</td>
                <td>{c.total_spent}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default CustomerList;
