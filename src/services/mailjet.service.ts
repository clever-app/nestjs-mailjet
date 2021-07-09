import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import mailjet, { Email } from 'node-mailjet';
import { IMailjetModuleOptions } from '../interfaces/mailjet-module-options.interface';
import { MAILJET_MODULE_OPTIONS } from './../constants/mailjet.constants';
import { EmailMessage } from './../interfaces/email-message.interface';

@Injectable()
export class MailjetService {
  private readonly logger = new Logger(MailjetService.name);

  private readonly mailClient: Email.Client;

  constructor(
    @Inject(MAILJET_MODULE_OPTIONS)
    private readonly options: IMailjetModuleOptions
  ) {
    // Afficher les options utilisés en mode debug
    this.logger.debug(
      `${MailjetService.name}.options: ${
        this.options ? JSON.stringify(this.options) : null
      }`
    );

    // instancier la connexion a mailjet
    this.mailClient = mailjet.connect(
      this.options.apiKey,
      this.options.apiSecret
    );
  }

  public async sendMail(messagesDetail: EmailMessage<any>[]) {
    let result = null;
    try {
      result = await this.mailClient.post('send', { version: 'v3.1' }).request({
        Messages: messagesDetail,
      });
    } catch (err) {
      this.logger.error(err.message);
      throw new HttpException('api.error.mailjet', err.statusCode);
    }
    return result;
  }
}
