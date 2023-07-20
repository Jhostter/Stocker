const Handlebars = require("handlebars");
const db = require("../mysqlConnection");
var moment = require("moment");

// const dataT = (r) => {
//   r.forEach(el => {
//     if(el.id == 20)
//     console.log(el.id)
//   });
// };

// const getData = async () => {
//   await db.query("SELECT * FROM productos", (err, rows) => {
//     dataT(rows);
//   });
// };

function view(req, res) {
  // getData();
  db.query(
      `SELECT codigoProducto, nombre, precio, cantidad, descripcion, categoria, fechaCompra, fechaVencimiento FROM productos`,
      (err, products) => {
 
        if (products.length === 0) {
          let errM = 'Debe registrar los productos antes de ver las ventas',
            link = '/'
            res.render("err/errorMessages", { errM, link });
        }else{
        Handlebars.registerHelper("moneda", (n) => {
          return `${n}.00`;
        });
        Handlebars.registerHelper("espacioNombre", (n) => {
          return n.replace("_", " ");
        });


        products.forEach((elem) => {
          elem.fechaCompra = moment(elem.fechaCompra).format("MMMM Do YYYY");
          elem.fechaVencimiento = moment(elem.fechaVencimiento).format(
            "[Hasta] MMMM YYYY"
          );
          elem.precio = elem.precio * elem.cantidad
        });

        res.render("tickets/view", { products });
      }
      }
    );
}
function searchProduct(req, res) {
  // let query = req.body.searchQuery;
  let dt = req.body.filter;
  // let querylike = `%${query}%`;
  let date = dt.replace('/', '-')
  req.getConnection((err, conn) => {
    conn.query(
      `select * from productos where fechaVenta = ? `,
      [date],
      (err, products) => {
        if (products.length === 0) {
          let errM = 'Lo sentimos, no hay productos vendidos en esta fecha',
            link = '/viewTickets'
            res.render("err/errorMessages", { errM, link });
        }else{
          products.forEach((elem) => {
          elem.fechaCompra = moment(elem.fechaCompra).format("MMMM Do YYYY");
          elem.fechaVencimiento = moment(elem.fechaVencimiento).format(
            "[Hasta] MMMM YYYY"
          );
        });
        res.render("tickets/view", { products });
      }
      }
    );
  });
}

module.exports = {
  view: view,
  searchProduct: searchProduct,
};
