export class Utilisateur {
    Id: number;
    Pseudo: string;
    Mail: string;
    Password: string;
    Role: string;
    Actif: number;
    ActivationToken: string;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.Pseudo = attachment.Pseudo;
      this.Mail = attachment.Mail;
      this.Password = attachment.Password;
      this.Role = attachment.Role;
      this.Actif = attachment.Actif;
      this.ActivationToken = attachment.ActivationToken;
    }
}