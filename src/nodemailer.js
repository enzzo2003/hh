const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

async function enviarEmail(req, res) {
    const { email, assunto } = req.body;
    const arquivo = req.file;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mapadesala@notredamecampinas.net.br',
            pass: '3gb3rt0#',
        },
    });

    const mailOptions = {
        from: 'mapadesala@notredamecampinas.net.br',
        to: email,
        subject: assunto,
        text: assunto,
        attachments: arquivo
            ? [
                  {
                      filename: arquivo.originalname,
                      path: arquivo.path,
                  },
              ]
            : [],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("ENVIADO EMAIL", email , assunto);
        res.json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ message: 'Erro ao enviar email' });
    }
}

module.exports = { enviarEmail, upload };
