const nodemailer = require('nodemailer');

module.exports = (formulario) => {
	var transporter = nodemailer.createTransport({
	host: 'send.one.com',
	port: 465,
	secure: true,
	auth: {
	user: 'hello@alejandroestarlich.es', // Cambialo por tu email
	pass: 'y0s0yG0kuWebmail' // Cambialo por tu password
 	}
});

const mailOptions = {
	from: `”${formulario.nombre} 👻” <${formulario.email}>`,
	to: 'alejandroestarlichmarketing@gmail.com',// Cambia esta parte por el destinatario
 	subject: formulario.asunto,
 	html: `
 		<strong>Nombre:</strong> ${formulario.nombre} <br/>
 		<strong>E-mail:</strong> ${formulario.email} <br/>
 		<strong>Mensaje:</strong> ${formulario.mensaje}
 	`
 	};

transporter.sendMail(mailOptions, function (err, info) {
 	if (err)
 		console.log(err)
 	else
 	console.log(info);
 	});
}