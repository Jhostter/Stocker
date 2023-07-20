const Handlebars = require("handlebars");
var moment = require("moment");

function view(req, res) {
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM productos", (err, products) => {
      if (products.length === 0) {
        let errM = 'Lo sentimos, no hay productos registrados.',
          link = '/'
          res.render("err/errorMessages", { errM, link });
      }else{
      Handlebars.registerHelper("moneda", (n) => {
        return `${n}.00`;
      });
      Handlebars.registerHelper("espacioNombre", (n) => {
        return n.replace('_', ' ');
      });
      products.forEach((elem) => {
        elem.fechaVenta = moment(elem.fechaVenta).format("MMMM Do YYYY");
      });
      res.render("products/view", { products });
    }
    });
  });
}

function add(req, res) {
  res.render("products/add");
}

function store(req, res) {
  const data = req.body;
  const abrName = data.nombre.substr(0, 3).toUpperCase();
  const pcode = asignCode(data.categoria, abrName);
  data.codigoProducto = pcode;
  const nameP = data.nombre.replace(' ', '_')
  data.nombre = nameP
  const fc = data.fechaCompra
  const fv = data.fechaVenta
  const fvc = data.fechaVencimiento

  req.getConnection((err, conn) => {
    conn.query(`INSERT INTO productos SET ?`, [data], (err, rows) => {
      if(err) console.log(err)
      res.redirect("/viewProducts");
    });
  });
}

const asignCode = (cg, abr) => {
  if (cg == "Comida") return `CO-${abr}100`;
  else if (cg == "Vestuario") return `RO-${abr}200`;
  else if (cg == "Calzados") return `CA-${abr}300`;
  else if (cg == "Cuidado_Personal") return `OA-${abr}400`;
  else if (cg == "Ferreteria") return `OA-${abr}400`;
  else if (cg == "Domesticos") return `OA-${abr}500`;
  else if (cg == "Escolares") return `OA-${abr}600`;
  else if (cg == "Otros_Articulos") return `OA-${abr}700`;
};

function destroy(req, res) {
  const id = req.body.id;

  req.getConnection((err, conn) => {
    conn.query('DELETE FROM productos WHERE id = ?', [id], (err, rows) => {
      res.redirect('/viewProducts');
    });
  })
}

function edit(req, res) {
  const id = req.params.id;

  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM productos WHERE id = ?', [id], (err, products) => {
      if (err) {
        res.json(err);
      }
       res.render('products/edit', { products });
    });
  });
}

function update(req, res) {
  const id = req.params.id;
  const data = req.body;
  const nameP = data.nombre.replace(' ', '_')
  data.nombre = nameP
  

  req.getConnection((err, conn) => {
    conn.query('UPDATE productos SET ? WHERE id = ?', [data, id], (err, rows) => {
      res.redirect('/viewProducts');
    });
  });
}

module.exports = {
  view: view,
  add: add,
  store: store,
  destroy: destroy,
  edit: edit,
  update: update,
};
