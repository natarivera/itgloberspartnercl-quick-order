import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "react-apollo";
import UPDATE_CART from "../graphql/updateCart.graphql"
import GET_PRODUCT from "../graphql/getProductBySku.graphql"
import { useCssHandles } from 'vtex.css-handles'
import "./styles.css"

const QuickOrder = () => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)

  const CSS_HANDLES = [
    "quickOrder__container",
    "quickOrder__form",
    "quickOrder__label-container",
    "quickOrder__label",
    "quickOrder__input",
    "quickOrder__input-btn"
  ]
  const handles = useCssHandles(CSS_HANDLES)

  const handleChange = (evt: any) => {
    setInputText(evt.target.value)
    console.log("input changed", inputText);
  }
  useEffect(() => {
    console.log("El resultado de mi producto es:", product, search)
    if (product) {
      let skuId = parseInt(inputText)
      addToCart({
        variables: {
          salesChannel: "1",
          items: [
            {
              id: skuId,
              quantity: 1,
              seller: "1"
            }
          ]
        }
      })
        .then(() => {
          window.location.href = "/checkout"
        })
    }
  }, [product, search])
  const addProductToCart = () => {
    //ingresar declaración de la mutación
    getProductData({
      variables: {
        sku: inputText
      }
    })
  }
  const searchProduct = (evt: any) => {
    evt.preventDefault();
    if (!inputText) {
      alert("Hola")
    } else {
      //Busqueda, data del producto
      setSearch(inputText)
      addProductToCart()
    }
  }
  return <div className={handles["quickOrder__container"]}>
    <h2>Compra rapida Alkosto </h2>
    <form className={handles["quickOrder__form"]} onSubmit={searchProduct}>
      <div className={handles["quickOrder__label-container"]} >
        <label className={handles["quickOrder__label"]} htmlFor="sku">Ingresa el número de SKU:</label>
        <input className={handles["quickOrder__input"]} id="sku" type="text" onChange={handleChange}></input>
      </div>
      <input className={handles["quickOrder__input-btn"]} type="submit" value="Añadir al carrito" />
    </form>
  </div>
}

export default QuickOrder