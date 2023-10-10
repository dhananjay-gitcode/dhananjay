import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import "./Table.css";
import Navbar from "./Navbar";
import { Checkbox } from "@shopify/polaris";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const fetch = useAuthenticatedFetch();
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [Details, setDetails] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:5005/products");
      setProducts(response.data);
    }
    fetchData();
  }, []);

  const handleProductClick = (products) => {
    setSelectedProduct(products);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setMessage(" ");
  };

  // const productsPerPage = 10;

  // const indexOfLastProduct = currentPage * productsPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // const currentProducts =
  //   products.length > 0
  //     ? products.slice(indexOfFirstProduct, indexOfLastProduct)
  //     : [];

  const [showPerPage, setShowPerPage] = useState(10);
  const productsPerPage = showPerPage;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleShowPerPageChange = (event) => {
    setShowPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const updateProduct = async (e) => {
    e.preventDefault();
    setMessage("Adding....");
    try {
      const response = await fetch("http://localhost:3060/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Details, selectedProductIds }),
      });
      const data = await response.json();
      setMessage(data.message);

      // Remove selected products from the products state array
      const updatedProducts = products.filter(
        (product) => !selectedProductIds.includes(product.id)
      );
      setProducts(updatedProducts);
    } catch (error) {
      setMessage("An error occurred while adding the product .");
    }

    setSelectedProductIds([]);
    setDetails("");
  };

  const handleProductSelection = (productId) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(
        selectedProductIds.filter((id) => id !== productId)
      );
      setSelectedProducts(
        selectedProducts.filter((product) => product.id !== productId)
      );
    } else {
      const product = products.find((product) => product.id === productId);
      setSelectedProductIds([...selectedProductIds, productId]);
      setSelectedProducts([...selectedProducts, product]);
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

  console.log("selected ids", selectedProductIds);
  const handleFormSubmit2 = () => {
    setModalOpen(true);
  };

  const handleChange1 = useCallback((newChecked) => setChecked(newChecked), []);
  return (
    <div>
      <Navbar />

      {selectedProducts.length > 0 && (
        <button onClick={handleFormSubmit2} className="btn btn-info">
          Post
        </button>
      )}
      <table id="customers">
        <thead>
          <tr>
            <th>
              <Checkbox checked={checked} onChange={handleChange1} />
            </th>
            <th>ID</th>
            <th>Title</th>
            <th>Discription</th>
            <th>Image</th>
            <th>status</th>
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
                    handleProduct(product);
                  }}
                />
              </td>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>{product.body_html}</td>
              <td>
                <img src={product.image?.src} alt="" />
              </td>
              <td>
                <button className="btn btn-success">unpublish</button>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleProductClick(product)}
                >
                  View Products
                </button>
              </td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={indexOfLastProduct >= products.length}
        >
          Next
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "10px 0",
        }}
      >
        <label>Show per page:</label>
        <select value={showPerPage} onChange={handleShowPerPageChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={150}>150</option>
          <option value={200}>200</option>
        </select>
      </div>

      {modalOpen && selectedProduct && (
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <h2>Product Details</h2>

            <img src={selectedProduct.image?.src} alt={selectedProduct.title} />
            <p>ID: {selectedProduct.id}</p>
            <p>Name: {selectedProduct.title}</p>
            {selectedProduct.variants &&
              selectedProduct.variants.length > 0 && (
                <p>Price: {selectedProduct.variants[0].price}</p>
              )}

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
            <p>{selectedProductIds.join(", ")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
