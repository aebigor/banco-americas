const express = require("express");
const fs = require("fs");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo"));
const app = express();
app.use(cors());
app.use(express.json());

const FILE = "usuarios.json";

// leer
const leer = () => JSON.parse(fs.readFileSync(FILE));

// guardar
const guardar = (data) => fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

// 🧾 REGISTRO
app.post("/registro", (req, res) => {
    let usuarios = leer();

    let existe = usuarios.find(u => u.usuario === req.body.usuario);

    if(existe){
        return res.status(400).json({ msg: "Usuario ya existe" });
    }

    usuarios.push(req.body);
    guardar(usuarios);

    res.json({ msg: "Usuario creado" });
});

// 🔐 LOGIN
app.post("/login", (req, res) => {
    let usuarios = leer();

    let user = usuarios.find(u =>
        u.usuario === req.body.usuario &&
        u.password === req.body.password
    );

    if(!user){
        return res.status(401).json({ msg: "Error login" });
    }

    res.json(user);
});

// 💸 TRANSFERENCIA
app.post("/transferir", (req, res) => {
    let { origen, destino, monto } = req.body;

    let usuarios = leer();

    let o = usuarios.find(u => u.usuario === origen);
    let d = usuarios.find(u => u.usuario === destino);

    if(!d) return res.status(404).json({ msg: "Destino no existe" });

    if(o.saldo < monto)
        return res.status(400).json({ msg: "Saldo insuficiente" });

    o.saldo -= monto;
    d.saldo += monto;

    guardar(usuarios);

    res.json({ msg: "Transferencia OK", saldo: o.saldo });
});

app.listen(3000, () => console.log("Servidor listo"));