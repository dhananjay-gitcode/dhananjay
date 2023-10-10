import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
// import "./Table.css";
import Navbar from "./Navbar";
import { Checkbox } from "@shopify/polaris";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const fetch = useAuthenticatedFetch();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [message, setMessage] = useState([]);
  const [product, setProduct] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [Details, setDetails] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data);
    }
    fetchData();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    console.log(selectedProduct);
    setModalOpen(true);
  };

  const handleProductCreate = async (product) => {
    // try {
    //   const response = await fetch("/api/update", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       selectedProduct,
    //     }),
    //   });
    //   const createdProduct = await response.json();
    //   setMessage(createdProduct.message);
    //   console.log("Product created:", createdProduct);
    // } catch (error) {
    //   console.error("Error creating product:", error);
    // }
  };

  const closeModal = () => {
    setModalOpen(false);
    setMessage(" ");
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedProduct,
        }),
      });

      const createdProduct = await response.json();
      console.log("Product created:", createdProduct);
      setMessage(createdProduct.message);
    } catch (error) {
      console.error("Error creating product:", error);
      setMessage("Error occured");
    }
  };
  const handleProductSelection = (productId) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(
        selectedProductIds.filter((id) => id !== productId)
      );
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  function handleProduct(product) {
    setDetails((prevSelectedProducts) => {
      const updatedSelectedProducts = { ...prevSelectedProducts };

      if (updatedSelectedProducts[product.id]) {
        // Product already selected, so remove it
        delete updatedSelectedProducts[product.id];
      } else {
        // Product not selected, so add it
        updatedSelectedProducts[product.id] = product;
      }
      return updatedSelectedProducts;
    });
  }
  console.log(Details);

  const handleChange1 = useCallback((newChecked) => setChecked(newChecked), []);

  return (
    <div>
      <Navbar />
      <table id="customers">
        <thead>
          <tr>
            <th>
              <Checkbox checked={checked} onChange={handleChange1} />
            </th>
            <th>ID</th>
            <th>Title</th>
            <th>Image</th>
            <th>Actions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedProductIds.includes(product.id)}
                  onChange={() => {
                    handleProductSelection(product.id);
                    handleProduct(product.id);
                  }}
                />
              </td>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>
                <img src={product.image.src} alt="" />
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleProductClick(product)}
                >
                  View Products
                </button>
              </td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleProductCreate(product)}
                >
                  Add Products
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-container">
        {products.length > productsPerPage && (
          <ul className="pagination">
            {Array(Math.ceil(products.length / productsPerPage))
              .fill()
              .map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      {modalOpen && selectedProduct && (
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <h2>Product Details</h2>
            <img src={selectedProduct.image.src} alt={selectedProduct.title} />
            <p>ID: {selectedProduct.id}</p>
            <p>Name: {selectedProduct.title}</p>
            <p>Price: {selectedProduct.variants[0].price}</p>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={closeModal}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={updateProduct}
            >
              Add
            </button>
            <p>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
