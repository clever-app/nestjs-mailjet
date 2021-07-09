export interface EmailMessageContact {
  Email: string;
  Name?: string;
}

export interface EmailMessage<EmailPayload> {
  From?: EmailMessageContact;
  To: EmailMessageContact[];
  Cc?: EmailMessageContact[];
  Bcc?: EmailMessageContact[];
  TemplateID?: number;
  Variables?: EmailPayload;
  TemplateLanguage?: boolean;
  Subject?: string;
  TextPart?: string;
  HTMLPart?: string;
}
