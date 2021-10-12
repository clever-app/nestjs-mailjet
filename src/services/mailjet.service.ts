import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import mailjet, { ConfigOptions, Email } from 'node-mailjet';
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
      this.options.apiSecret,
      {
        // ajout de l'option sandboxMode seulement si l'option est activée
        ...(!!this.options.sandboxMode && {
          perform_api_call: this.options.sandboxMode,
        }),
      }
    );

    if (!this.mailClient) {
      throw new Error('Failed to initialize Mailjet client.');
    }
  }

  public async sendMail(messagesDetail: EmailMessage<any>[]) {
    let result = null;

    const options: ConfigOptions = {
      version: 'v3.1',
    };

    try {
      result = await this.mailClient.post('send', options).request({
        Messages: messagesDetail,
      });
    } catch (err) {
      this.logger.error(err.message);
      throw new HttpException('api.error.mailjet', err.statusCode);
    }
    return result;
  }
}
