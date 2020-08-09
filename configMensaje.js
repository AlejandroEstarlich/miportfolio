const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = (formulario) => {
	var transporter = nodemailer.createTransport(smtpTransport({
	service:'gmail',
	tls: { rejectUnauthorized: false },
	auth: {
		user: 'alejandroestarlichmarketing@gmail.com', // Cambialo por tu email
		pass: '4l3j4ndr0' // Cambialo por tu password
 	}
}));

const mailOptions = {
	from: `”${formulario.nombre} 👻” <${formulario.email}>`,
	to: 'hello@alejandroestarlich.es',// Cambia esta parte por el destinatario
 	subject: 'Contacto desde el portfolio',
 	html: `
 		<strong>Nombre:</strong> ${formulario.nombre} <br/>
 		<strong>E-mail:</strong> ${formulario.email} <br/>
 		<strong>Mensaje:</strong> ${formulario.message}
 	`
 	};

transporter.sendMail(mailOptions, function (err, info) {
 	if (err)
 		console.log(err)
 	else
 	console.log(info);
 	});
}