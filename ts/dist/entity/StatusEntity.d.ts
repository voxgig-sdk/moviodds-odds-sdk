import { MovioddsOddsEntityBase } from '../MovioddsOddsEntityBase';
import type { MovioddsOddsSDK } from '../MovioddsOddsSDK';
import type { Control } from '../types';
import type { Status, StatusLoadMatch } from '../MovioddsOddsTypes';
declare class StatusEntity extends MovioddsOddsEntityBase<Status> {
    constructor(client: MovioddsOddsSDK, entopts: any);
    make(this: StatusEntity): StatusEntity;
    load(this: any, reqmatch?: StatusLoadMatch, ctrl?: Control): Promise<StatusEntity>;
}
export { StatusEntity };
