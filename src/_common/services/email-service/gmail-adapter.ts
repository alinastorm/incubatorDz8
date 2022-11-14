import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"


const transport: SMTPTransport | SMTPTransport.Options | string = {
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || '',
    },
}

class EmailService {

    transporter!: nodemailer.Transporter<SMTPTransport.SentMessageInfo>

    constructor(private transport: SMTPTransport | SMTPTransport.Options | string) { }
    //async constructor
    async then(resolve: any, reject: any) {
        console.log('EmailService ... ');
        try {
            this.createTransporter
            resolve()
        } catch (error) {
            this.stop()
            console.log('EmailService error:', error);
        }
    }

    createTransporter() {
        const transport = nodemailer.createTransport(this.transport)
        if (!transport) throw Error('EmailService createTransporter error')
        this.transporter = transport
        console.log("Email transport:", this.transport);
    }
    sendActivationMail(to: string | Mail.Address | (string | Mail.Address)[] | undefined, link: string) {
        const mailOptions: Mail.Options = {
            from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
            to,
            subject: `Активация аккаунта ` + process.env.API_URL,
            text: '',
            html:
                `<div>
                 <h1>Добро пожаловать</h1>
                 <h1>Для активации аккаунта необходимо перейти по ссылке:</h1>
                 <a href = "${link}">Активировать аккаунт</a>
                 </div>
                 `
        }

        const info = this.transporter.sendMail(mailOptions, (err) => { })


    }
    sendEmail(to: string, subject: string, message: string) {
        const mailOptions: Mail.Options = {
            from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
            to,
            subject,
            text: '',
            html: message
        }

        const info = this.transporter.sendMail(mailOptions, (err, data) => {
            if (err) throw Error(err.message)
            if (data) console.log('transporter.sendMail data:', data)

        })

    }
    stop() {
        this.transporter.close()
    }
}
//@ts-ignore
export default await new EmailService(transport)