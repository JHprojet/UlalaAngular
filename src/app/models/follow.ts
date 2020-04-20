import { Utilisateur } from './utilisateur';

export class Follow {
    Id: number;
    Follower: Utilisateur;
    Followed: Utilisateur;

    constructor(attachment) {
        this.Id = attachment.Id;
        this.Follower = attachment.Follower;
        this.Followed = attachment.Followed;
      }
}
