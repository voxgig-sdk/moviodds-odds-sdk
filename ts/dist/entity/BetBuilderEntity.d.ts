import { MovioddsOddsEntityBase } from '../MovioddsOddsEntityBase';
import type { MovioddsOddsSDK } from '../MovioddsOddsSDK';
import type { Control } from '../types';
import type { BetBuilder, BetBuilderCreateData } from '../MovioddsOddsTypes';
declare class BetBuilderEntity extends MovioddsOddsEntityBase<BetBuilder> {
    constructor(client: MovioddsOddsSDK, entopts: any);
    make(this: BetBuilderEntity): BetBuilderEntity;
    create(this: any, reqdata?: BetBuilderCreateData, ctrl?: Control): Promise<BetBuilderEntity>;
}
export { BetBuilderEntity };
