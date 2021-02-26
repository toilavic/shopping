const mongoose = require("mongoose");
const Item = require("../models/products");
const User = require("../models/user");
const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
const server = require('../serverTest');
// const apiAddress = "https://stormy-meadow-11036.herokuapp.com/";
const apiAddress = "http://localhost:5000/";

process.env.NODE_ENV = 'test';

beforeEach(async () => {
  await Item.deleteMany({});
  await User.deleteMany({});

  const itemObjects = helper.initialItems.map((item) => new Item(item));
  const promiseArray = itemObjects.map((item) => item.save());
  await Promise.all(promiseArray);
});

describe("when there is initially some items saved", () => {
  it("items are returned as json", async () => {
    await api
      .get("/items")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("all items are returned", async () => {
    const response = await api.get("/items");

    expect(response.body).toHaveLength(helper.initialItems.length);
  });

  it("a specific item is within the returned items", async () => {
    const response = await api.get("/items");

    const titles = response.body.map((r) => r.title);
    expect(titles).toContain("Gloves");
  });
});

describe(" a new item", () => {
  const newItem = {
    title: "Boots",
    description: "snow boots",
    category: "Shoes",
    location: "Finland",
    images: ["1", "2"],
    deliveryType: "Pickup",
    price: 12,
  };
  describe("non logged in user ", () => {
    it("a valid item cannot be added", async () => {
      await api
        .post("/items")
        .send(newItem)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/items");

      expect(response.body).toHaveLength(helper.initialItems.length);
    });
  });
  describe("if user logged in...", () => {
    const newUser = {
      username: "UserWithItems",
      name: "UserWithItems",
      password: "UserWithItems",
    };

    it("a valid item can be added", async () => {
      const createdUser = await api
        .post("/users")
        .send(newUser)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      await api
        .post("/api/items")
        .send(newItem)
        .set({ Authorization: `Bearer ${createdUser.body.token}` })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/items");

      expect(response.body).toHaveLength(helper.initialItems.length + 1);
    });

    it("item without title is not added", async () => {
      const createdUser = await api
        .post("/users")
        .send(newUser)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const newItem = {
        description: "Old cardigan found behind my piano",
        category: "Clothes",
        location: "Tornio",
        images: [],
        deliveryType: "Shipping",
        price: 59.99,
      };

      await api
        .post("/api/items")
        .send(newItem)
        .set({ Authorization: `Bearer ${createdUser.body.token}` })
        .expect(400);

      const response = await api.get("/api/items");

      it(response.body).toHaveLength(helper.initialItems.length);
    });
  });
});

describe("viewing a specific item", () => {
  it("an item with valid id can be viewed", async () => {
    const itemsAtStart = await helper.itemsInDb();

    const itemToView = itemsAtStart[0];

    const resultItem = await api
      .get(`/api/items/${itemToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedItemToView = JSON.parse(JSON.stringify(itemToView));

    expect(resultItem.body).toEqual(processedItemToView);
  });
});

afterAll(() => {
  mongoose.connection.close();
});