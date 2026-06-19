require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const formatoColombiano = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

async function crear(name, description, image, price) {
  try {
    await pool.query(
      'INSERT INTO public."Productos" (name, description, image, price) VALUES ($1, $2, $3, $4)',
      [name, description, image, price],
    );
    console.log(
      `Se ha insertado nombre: ${name}, descripcion: ${description} image ${image} price ${price}`,
    );
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

async function listar() {
  try {
    const productos = await pool.query('SELECT * FROM public."Productos"');

    productos.rows.forEach((product) => {
      console.log(
        `El producto ${product.id} con nombre ${product.name} cuesta ${formatoColombiano.format(parseInt(product.price, 10))}`,
      );
    });
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

listar();
