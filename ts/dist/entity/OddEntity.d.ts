import { MovioddsOddsEntityBase } from '../MovioddsOddsEntityBase';
import type { MovioddsOddsSDK } from '../MovioddsOddsSDK';
import type { Control } from '../types';
import type { Odd, OddLoadMatch, OddListMatch } from '../MovioddsOddsTypes';
declare class OddEntity extends MovioddsOddsEntityBase<Odd> {
    constructor(client: MovioddsOddsSDK, entopts: any);
    make(this: OddEntity): OddEntity;
    load(this: any, reqmatch?: OddLoadMatch, ctrl?: Control): Promise<OddEntity>;
    list(this: any, reqmatch?: OddListMatch, ctrl?: Control): Promise<OddEntity[]>;
}
export { OddEntity };
