import React from 'react'
import { useAuthenticatedFetch } from "../hooks";

export function ThemeComponent() {
  
  const fetch = useAuthenticatedFetch();
   const handleSubmit = async () => {
    try {
      const response = await fetch("/get/theme", {
        method: "GET",
        headers: {
          
        }
      });
      const themeData = await response.json();
      console.log(themeData);
    } catch (error) {
      console.log("error while fetching",error);
    }
  };  

  const handlePopulate = async () => {
    try {
        const response = await fetch("/api/themes", {
            method: "get",
            headers: {
              
            }
        });
        const responseData = await response.json(); 
        console.log(responseData); 
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
};


  return (
    <>
    <h1>hii there,this is  components file...</h1>
    <br/>   <br/>
    <button type="submit" onClick={handleSubmit}>
          fetch Theme
        </button>
        <br/>
        <button type="submit" onClick={handlePopulate}>
          fetch Data
        </button>
        <br/>
    </>
  )
}

export default ThemeComponent;
