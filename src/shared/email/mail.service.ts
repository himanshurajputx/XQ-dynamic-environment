import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "../config";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {}

  private getSMTPConfigs() {
    return [
      {
        name: "primary",
        host: this.configService.get("EMAIL_SMTP1_HOST"),
        port: Number(this.configService.get("EMAIL_SMTP1_PORT")),
        secure: Boolean(this.configService.get("EMAIL_SMTP1_SECURE")),
        auth: {
          user: this.configService.get("EMAIL_SMTP1_USER"),
          pass: this.configService.get("EMAIL_SMTP1_PASS"),
        },
      },
      // {
      //   name: "secondary",
      //   host: this.configService.get("SMTP2_HOST"),
      //   port: this.configService.get("SMTP2_PORT"),
      //   secure: false,
      //   auth: {
      //     user: this.configService.get("SMTP2_USER"),
      //     pass: this.configService.get("SMTP2_PASS"),
      //   },
      // },
    ];
  }

  async sendEmail(to: string, subject: string, html: string) {
    const smtpConfigs = this.getSMTPConfigs();
    for (const config of smtpConfigs) {
      console.log(">>>>>>>>>>>>>>>>>", config);
      try {

        const transporter = nodemailer.createTransport({
          // @ts-ignore
          host: config.host,
          port: config.port,
          secure: config.secure,
          auth: config.auth,
        });

        const result = await transporter.sendMail({
          from: "onboarding@resend.dev",
          to,
          subject,
          html,
        });

        this.logger.log(`Email sent using ${config.name}: ${result.messageId}`);
        return result;
      } catch (error) {
        this.logger.error(`Failed using ${config.name}: ${error.message}`);
      }
    }

    throw new Error("All SMTP providers failed.");
  }
}
