require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 conectar Mongo
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Mongo conectado"))
.catch(err => console.log(err));

// 📦 modelo usuario
const Usuario = mongoose.model("Usuario", {
    usuario: String,
    password: String,
    saldo: Number,
    numeroCuenta: String,
    tipoCuenta: String,
    direccion: String,
    correo: String,
    residencia: String,
    estadoCivil: String,
    personas: String,
    trabajo: String,
    salario: Number,
    gastos: Number,
    deudas: Number,
    inversiones: Number
});

// 🧾 REGISTRO
app.post("/registro", async (req, res) => {

    let existe = await Usuario.findOne({ usuario: req.body.usuario });

    if(existe){
        return res.status(400).json({ msg: "Usuario ya existe" });
    }

    let nuevo = new Usuario(req.body);
    await nuevo.save();

    res.json({ msg: "Usuario creado" });
});

// 🔐 LOGIN
app.post("/login", async (req, res) => {

    let user = await Usuario.findOne({
        usuario: req.body.usuario,
        password: req.body.password
    });

    if(!user){
        return res.status(401).json({ msg: "Error login" });
    }

    res.json(user);
});

// 👤 OBTENER USUARIO
app.get("/usuario/:usuario", async (req, res) => {
    let user = await Usuario.findOne({ usuario: req.params.usuario });

    if(!user) return res.status(404).json({ msg: "No existe" });

    res.json(user);
});

// 💸 TRANSFERENCIA
app.post("/transferir", async (req, res) => {

    let { origen, destino, monto } = req.body;

    let o = await Usuario.findOne({ usuario: origen });
    let d = await Usuario.findOne({ usuario: destino });

    if(!d) return res.status(404).json({ msg: "Destino no existe" });

    if(o.saldo < monto)
        return res.status(400).json({ msg: "Saldo insuficiente" });

    o.saldo -= monto;
    d.saldo += monto;

    await o.save();
    await d.save();

    res.json({ msg: "Transferencia OK", saldo: o.saldo });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo"));