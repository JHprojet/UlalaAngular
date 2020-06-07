export class User {
    Id: number;
    Username: string;
    Mail: string;
    Password: string;
    Role: string;
    Active: number;
    ActivationToken: string;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.Username = attachment.Username;
      this.Mail = attachment.Mail;
      this.Password = attachment.Password;
      this.Role = attachment.Role;
      this.Active = attachment.Active;
      this.ActivationToken = attachment.ActivationToken;
    }
}