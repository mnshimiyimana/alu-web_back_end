import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

const app = express();
const redis = createClient();

const listProducts = [
  {
    id: 1,
    name: 'Suitcase 250',
    price: 50,
    stock: 4,
  },
  {
    id: 2,
    name: 'Suitcase 450',
    price: 100,
    stock: 10,
  },
  {
    id: 3,
    name: 'Suitcase 650',
    price: 350,
    stock: 2,
  },
  {
    id: 4,
    name: 'Suitcase 1050',
    price: 550,
    stock: 5,
  },
];

const getItemId = (itemId) => {
  return listProducts.find((item) => item.id === itemId);
};

const reserveStockById = (itemId, stock) => {
  redis.set(itemId, stock);
};

async function getCurrentReservedStockById(itemId) {
  const getAsync = promisify(redis.get).bind(redis);
  let stock = await getAsync(itemId);
  return stock;
}

app.get('/list_products', (req, res) => {
  res.json(
    listProducts.map((item) => {
      return {
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        initialAvailableQuantity: item.stock,
      };
    })
  );
});

app.get('list_products/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = getItemId(itemId);
  const stock = await getCurrentReservedStockById(itemId);
  if (!item || stock) {
    res.status(404).json({ status: 'Product not found' });
    return;
  }
  res.json({
    itemId: item.id,
    itemName: item.name,
    price: item.price,
    initialAvailableQuantity: item.stock,
    currentQuantity: stock,
  });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    res.status(404).json({ status: 'Product not found' });
    return;
  }
  const stock = await getCurrentReservedStockById(itemId);
  console.log(stock);
  if (stock === null) {
    reserveStockById(itemId, item.stock - 1);
    return res.json({ status: 'Reservation confirmed', itemId });
  }
  if (stock <= 0) {
    return res
      .status(403)
      .json({ status: 'Not enough stock available', itemId });
  }
  reserveStockById(itemId, stock - 1);
  res.json({ status: 'Reservation confirmed', itemId });
});

app.listen(1245, () => {
  console.log('API available on localhost port 1245');
});
