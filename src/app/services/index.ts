import { AccessService } from './access-service';
import { BossService } from './boss-service';
import { BossesPerZoneService } from './bosses-per-zone-service';
import { CharactersConfigurationService } from './characters-configuration-service';
import { ClasseService } from './classe-service';
import { FavoriteStrategyService } from './favorite-strategy-service';
import { FollowService } from './follow-service';
import { ImageService } from './image-service';
import { IsAdmin } from './is-admin';
import { IsAnonyme } from './is-anonyme';
import { IsToActivate } from './is-to-activate';
import { IsUser } from './is-user';
import { SkillService } from './skill-service';
import { StrategyService } from './strategy-service';
import { TeamService } from './team-service';
import { ToyService } from './toy-service';
import { UserService } from './user-service';
import { CustomValidators } from './validators';
import { VoteService } from './vote-service';
import { ZoneService } from './zone-service';
import { environement } from './environement';

export const services: any[] = [AccessService,BossService,BossesPerZoneService,CharactersConfigurationService,ClasseService,FavoriteStrategyService,
                                FollowService,ImageService,IsAdmin,IsAnonyme,IsToActivate,IsUser,SkillService,StrategyService,TeamService,
                                ToyService,UserService,CustomValidators,VoteService,ZoneService, environement];

export * from './access-service';
export * from './boss-service';
export * from './bosses-per-zone-service';
export * from './characters-configuration-service';
export * from './classe-service';
export * from './favorite-strategy-service';
export * from './follow-service';
export * from './image-service';
export * from './is-admin';
export * from './is-anonyme';
export * from './is-to-activate';
export * from './is-user';
export * from './skill-service';
export * from './strategy-service';
export * from './team-service';
export * from './toy-service';
export * from './user-service';
export * from './validators';
export * from './vote-service';
export * from './zone-service';
export * from './environement';