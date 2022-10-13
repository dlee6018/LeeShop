// import request from "supertest";
import app from "../server.js";

const email = "admin@example.com";
const password = "123456";
let TOKEN = "";
let PRODUCT_ID = "";

test("test working", async () => {
  const res = await request(app).get("/test");
  expect(res.text).toEqual("test working");
});

// Login, create product, check product, and finally delete the product
describe("product workflow ", () => {
  expect.assertions(1);
  test("login", async () => {
    expect.assertions(1);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let response = await request(app).post("/api/users/login").send(
        {
          email,
          password,
        },
        config
      );
      console.log(response.body, "token");
      TOKEN = response.body.token;
      expect(response.body.email).toEqual("admin@example.com");
    } catch (error) {
      console.error(error);
      expect(error).toMatch("error");
    }
  });
  test("create product", async () => {
    expect.assertions(1);

    try {
      let response = await request(app)
        .post("/api/products/")
        .set("Authorization", "Bearer " + TOKEN);

      PRODUCT_ID = response.body._id;
      expect(response.body.price).toEqual(0);
    } catch (error) {
      console.error(error);
      expect(error).toMatch(error);
    }
  });
  test("get product by id", async () => {
    const id = "60c300e21b08841150939fea";
    const response = await request(app).get(`/api/products/${PRODUCT_ID}`);
    expect(response.body._id).toEqual(PRODUCT_ID);
  });
  test("delete product", async () => {
    expect.assertions(1);

    try {
      let response = await request(app)
        .delete(`/api/products/${PRODUCT_ID}`)
        .set("Authorization", "Bearer " + TOKEN);

      console.log(response.body.message);
      expect(response.body.message).toEqual("Product removed");
    } catch (error) {
      console.error(error);
      expect(error).toMatch(error);
    }
  });
});
