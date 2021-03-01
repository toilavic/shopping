const Item = require("../models/products");
const User = require("../models/user");

const initialItems = [
  {
    title: "Gloves",
    description: "hjerlo",
    category: "helo",
    location: "Oulu",
    images: ["helo", "helo"],
    price: 20,
    date: new Date(),
    deliveryType: "Shipping",
  },
];

const nonExistingId = async () => {
  const item = new Item({
    title: "Will be deleted",
    description: "Deleted to get valid but non existing id",
    category: "No",
    location: "Jyvaskyla",
    images: ["0", "0"],
    date: new Date(),
    price: 33.99,
    deliveryType: "0",
  });
  await item.save();
  await item.remove();

  return item._id.toString();
};

const itemsInDb = async () => {
  const items = await Item.find({});
  return items.map((item) => item.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialItems,
  nonExistingId,
  itemsInDb,
  usersInDb,
};
