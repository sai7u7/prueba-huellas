const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let credencialesGuardadas = null;

// Simulación de generación de credenciales WebAuthn
app.get("/registro", (req, res) => {
    res.json({
        challenge: new Uint8Array(32).fill(8), 
        rp: { name: "Mi Aplicación" },
        user: { id: new Uint8Array(16).fill(1), name: "usuario", displayName: "Usuario" },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        authenticatorSelection: { authenticatorAttachment: "platform" },
        timeout: 60000,
        attestation: "direct"
    });
});

app.post("/guardar", (req, res) => {
    credencialesGuardadas = req.body.credencial;
    res.json({ mensaje: "Huella guardada correctamente." });
});

// Simulación de autenticación con huella
app.get("/autenticacion", (req, res) => {
    if (!credencialesGuardadas) return res.status(400).json({ mensaje: "No hay huellas registradas." });

    res.json({
        challenge: new Uint8Array(32).fill(8),
        allowCredentials: [{ type: "public-key", id: credencialesGuardadas.id }]
    });
});

app.post("/verificar", (req, res) => {
    if (req.body.credencial.id === credencialesGuardadas.id) {
        res.json({ mensaje: "Autenticación exitosa." });
    } else {
        res.json({ mensaje: "Error en la autenticación." });
    }
});

app.listen(3000, () => console.log("Servidor corriendo en https://1aba-148-255-225-224.ngrok-free.app/registro"));

app.get("/registro", (req, res) => {
    console.log("Solicitud recibida en /registro");
    res.json({ status: "OK", message: "Registro exitoso" });
});
