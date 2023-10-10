import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./Table.css";
import Navbar from "./Navbar";

export function Collection() {
  const [smart_collections, setSmart_collections] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "http://localhost:3003/smart_collections"
      );
      setSmart_collections(response.data);
    }
    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      <table id="customers">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {smart_collections &&
            smart_collections.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>
                  {/* other method for image fetching */}
                  <td>{c.image && <img src={c.image?.src} alt="" />}</td>

                  <img src={c.image?.src} alt="" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default Collection;
