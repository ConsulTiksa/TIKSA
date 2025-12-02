// netlify/functions/sendQuote.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  // Solo aceptar POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Método no permitido" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const {
      nombre,
      email,
      empresa,
      servicio,
      cantidad,
      presupuesto,
      mensaje,
      avisoPrivacidad,
    } = data;

    if (!nombre || !email || !servicio || !mensaje) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Faltan campos obligatorios en el formulario.",
        }),
      };
    }

    // Construir contenido del correo
    const html = `
      <h2>Nueva solicitud de cotización TIKSA</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Empresa:</strong> ${empresa || "No especificada"}</p>
      <p><strong>Servicio de interés:</strong> ${servicio}</p>
      <p><strong>Cantidad aproximada:</strong> ${cantidad || "No especificada"}</p>
      <p><strong>Presupuesto estimado:</strong> ${presupuesto || "No especificado"}</p>
      <p><strong>Aviso de privacidad aceptado:</strong> ${
        avisoPrivacidad === "Aceptado" ? "Sí" : "No"
      }</p>
      <hr />
      <p><strong>Detalles del proyecto:</strong></p>
      <p>${mensaje.replace(/\n/g, "<br>")}</p>
    `;

    // Enviar correo con Resend
    const result = await resend.emails.send({
      from: "TIKSA <no-reply@tudominio.com>", // Cambia a un dominio verificado en Resend
      to: "consultores.tiksa@gmail.com",
      reply_to: email,
      subject: "Nueva solicitud de cotización - TIKSA",
      html,
    });

    // Puedes loguear result si quieres depurar
    console.log(result);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Correo enviado correctamente." }),
    };
  } catch (error) {
    console.error("Error al enviar correo con Resend:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error interno al enviar la solicitud.",
      }),
    };
  }
};
