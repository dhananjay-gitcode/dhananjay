import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
require('dotenv').config();
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

//------Theme code-------------------
app.get("/get/theme", async (_req,res) => {
  try {
    const themeData = await shopify.api.rest.Asset.all({
      session: res.locals.shopify.session,
      theme_id: 151390486844,
    });
    res.status(200).send(themeData);
  } catch (error) {
    res.send(error);
  }
});

app.get("/api/themes", async (_req,res) => {
  try {
    const themeData = await shopify.api.rest.Asset.all({
      session: res.locals.shopify.session,
      theme_id: 151390486844,
    });
    res.status(200).send(themeData);
  } catch (error) {
    res.send(error);
  }
});

//get order from cli
app.get("/api/orders", async (req, res) => {
  try {
    const session = res.locals.shopify.session
    const data = await shopify.api.rest.Order.all({ session: session, })
    res.status(200).send(data)

  } catch (err) {
    console.log(err)
  }
});


app.get("/product/fetch", async (_req,res) => {
  session = res.locals.shopify.session;
  try{
    const fetch = await shopify.api.rest.Product.all({
      session: session,
      theme_id: '151390486844'
    });
    res.status(200).send(fetch)
  } catch(error){
    res.send(error);
  }
});

app.get("/api/themes", async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    // const asset = new shopify.api.rest.Asset({ session: session });
    // asset.theme_id = 155105165599;
    // asset.key = "sections/weeklyhow.liquid";
    // asset.value = "<img src='backsoon-postit.png'><p>We are busy updating the store for you and will be back within the hour.</p>";
    // const response = await asset.save({
    //   update: true,
    // });
    const response = await shopify.api.rest.Asset.all({
      session: session,
      theme_id: '151390486844',
    });
    res.status(200).send(response);
  } catch (err) {
    res.send(err)
  }
  //console.log(currentContent);
});



app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.post("/api/update/up", async (req, res) => {
  const data = req.body.Details;
  const data2 = req.body.selectedProductIds;
  try {
    // Session is built by the OAuth process
    const session = res.locals.shopify.session;
    const product = new shopify.api.rest.Product({ session: session });
    // product.title = "Burton Custom Freestyle 151";
    // product.body_html = "<strong>Good snowboard!</strong>";
    // product.vendor = "Burton";
    // product.product_type = "Snowboard";
    // product.status = "draft";
    for (var i = 0; i < data2.length; i++) {
      var key = data2[i];
      const session = res.locals.shopify.session;
      const product = new shopify.api.rest.Product({ session: session });
      product.title = data[key].title;
      product.body_html = data[key].body_html;
      product.vendor = data[key].vendor;
      product.product_type = data[key].product_type;
      product.status = data[key].status;
      product.tags = data[key].tags;
      product.variants = [
        {
          price: data[key].variants[0].price,
          sku: data[key].variants[0].sku,
        },
      ];
      product.images = [
        {
          src: data[key].images[0]?.src,
        },
        {
          src: "https://unsplash.com/s/photos/classic",
        },
      ];
      product.tags = data[key].tags;
      await product.save({
        update: true,
      });
    }
   
    res.json({ message: `Product  added successfully!` });
  } catch (err) {
    res.json(err);
  }
});

app.post('/install', async (req, res) => {
  const { storeName } = req.body;
  
  if (storeName) {
    // Replace 'YOUR_API_KEY' with your actual Shopify API key
    const apiKey = '8115ef02435a4934af1cb2f4b4af4f32';

    const installUrl = `https://${storeName}.myshopify.com/admin/oauth/authorize?client_id=${apiKey}&scope=read_products&redirect_uri=${req.headers.origin}/callback`;

    res.json({ installUrl });
  } else {
    res.status(400).json({ error: 'Missing storeName' });
  }
});

// app.post("/api/update/up", async (req, res) => {
//   const data = req.body.Details;
//   const data2 = req.body.selectedProductIds;
//   for (var i = 0; i < data2.length; i++) {
//     var key = data2[i];
//     const session = res.locals.shopify.session
//     const product = new shopify.api.rest.Product({ session: session });
//     product.title = data[key].title;
//     product.body_html = data[key].body_html;
//     product.vendor = data[key].vendor;
//     product.product_type = data[key].product_type;
//     product.status = data[key].status;
//     product.tags = data[key].tags;
//     product.variants = [
//       {

//         "price": data[key].variants[0].price,
//       }
//     ];
//     product.images = [
//       {

//         "src": data[key].images[0].src,
//       },
//       {
//         "src": "https://unsplash.com/s/photos/classic",
//       }
//     ];
//     product.tags = data[key].tags;
//     await product.save({
//       update: true,
//     });
//   }
//   res.json({ message: `Product  added successfully!` });
// });

app.post("/api/update", async (req, res) => {
  const products = req.body.selectedProducts;
  const ids = req.body.selectedProductIds;
  const session = res.locals.shopify.session;

  try {
    for (const data of products) {
      const product = new shopify.api.rest.Product({
        session: session,
      });
      var i = ids[data];

      product.title = data[i].title;
      product.body_html = data[i].body_html;
      product.vendor = data[i].vendor;
      product.status = data[i].status;
      product.tags = data[i].tag;
      product.variants = [
        {
          price: data[i].variants[0].price,
          sku: data[i].variants[0].sku,
        },
      ];

      product.images = [
        {
          src: data[i].images[0].src,
        },
      ];

      await product.save({
        update: true,
      });
    }

    res.json({ message: "Products added successfully..." });
  } catch (error) {
    console.error("Error adding products:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding products" });
  }
});

app.post("/api/update", async (req, res) => {
  const products = req.body.selectedProductIds;
  const session = res.locals.shopify.session;
  const createdProducts = [];

  try {
    for (const data of products) {
      const product = new shopify.api.rest.Product({
        session: session,
      });
      product.title = data.title;
      product.body_html = data.body_html;
      product.vendor = data.vendor;
      product.status = data.status;
      product.tags = data.tag;
      product.variants = [
        {
          price: data.variants[0].price,
          sku: data.variants[0].sku,
        },
      ];
      product.images = [
        {
          src: data.images[0].src,
        },
      ];
      await product.save({
        update: true,
      });

    
    }
    res.json({ message: "Products added successfully", createdProducts });
  } catch (error) {
    console.error("Error adding products:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding products" });
  }
});

// app.post("/api/update", async (req, res) => {
//   const data = req.body.selectedProduct;
//   const session = res.locals.shopify.session;
//   // Create a new product object
//   const product = new shopify.api.rest.Product({
//     session: session,
//   });
//   product.title = data.title;
//   product.body_html = data.body_html;
//   product.vendor = data.vendor;
//   product.status = data.status;
//   product.tags = data.tag;
//   product.variants = [
//     {
//       price: data.variants[0].price,
//       sku: data.variants[0].sku,
//     },
//   ];
//   product.images = [
//     {
//       src: data.images[0].src,
//     },
//   ];
//   await product.save({
//     update: true,
//   });
//   res.json({ message: `product added successfully` });
//   // res.status(201).send(createdProduct);
// });

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;
  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));
app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
