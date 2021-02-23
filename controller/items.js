const itemsRouter = require("express").Router();
const Item = require("../models/products");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");
const _ = require("lodash");

// get item
itemsRouter.get("/", async (req, res) => {
  const category = req.query.category;
  const country = req.query.country;
  const city = req.query.city;
  const date = req.query.date; // 'asc' || 'desc'

  let items = await Item.find({}).populate("user");

  if (category) items = _.filter(items, ["category", category]);
  if (country) items = _.filter(items, (e) => e.location.country === country);
  if (city) items = _.filter(items, (e) => e.location.city === city);
  if (date) items = _.orderBy(items, ["date"], [date]);
  res.json(items);
});

// add item
itemsRouter.post(
  "/",
  middleware.getToken,
  async (req, res) => {
    const body = req.body;
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!req.token || !decodedToken.id) return res.status(401).json({ error: "token missing or invalid" })

    const user = await User.findById(decodedToken.id);
    const item = new Item({
      title: body.title,
      description: body.description,
      category: body.category,
      location: body.location,
      images: body.images,
      deliveryType: body.deliveryType,
      price: body.price,
      contact: body.contact,
      date: new Date(),
      user: user._id,
    });
    const savedItem = await item.save();
    user.items = user.items.concat(savedItem._id);

    await user.save();
    console.log(savedItem);
    res.json(savedItem);
  }
);

itemsRouter.get("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  item ? res.json(item) : res.status(404).end();
});

// edit item
itemsRouter.put(
  "/:id",
  middleware.checkImg,
  middleware.getToken,
  async (req, res) => {
    const body = req.body;
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!req.token || !decodedToken.id) return res.status(401).json({ error: "token missing or invalid" });

    const foundItem = await Item.findById(req.params.id);
    const item = {
      title: body.title,
      description: body.description,
      category: body.category,
      location: body.location,
      images: body.images,
      deliveryType: body.deliveryType,
      price: body.price,
      date: new Date(),
    };

    if (foundItem.user.toString() === decodedToken.id) {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {
        new: true,
      });
      res.json(updatedItem);
    } else {
      res.status(401).json({ error: "user isn't allowed to edit this item" });
    }
  }
);

// delete
itemsRouter.delete("/:id", middleware.getToken, async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id)  return res.status(401).json({ error: "token missing or invalid" });

  const item = await Item.findById(req.params.id);
  if (item === null) res.send("Wrong item ID");
  else if (item.user.toString() === decodedToken.id) {
    await Item.findByIdAndRemove(req.params.id);
    res.send("Deleted");
    res.status(204).end();
  } else {
    res.status(401).json({ error: "user not allowed to delete this item" });
  }

});

module.exports = itemsRouter;