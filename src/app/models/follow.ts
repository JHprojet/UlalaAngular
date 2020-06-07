import { User } from './user';

export class Follow {
    Id: number;
    Follower: User;
    Followed: User;

    constructor(attachment) {
        this.Id = attachment.Id;
        this.Follower = attachment.Follower;
        this.Followed = attachment.Followed;
      }
}
