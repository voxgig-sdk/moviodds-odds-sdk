import { BetBuilderEntity } from './entity/BetBuilderEntity';
import { OddEntity } from './entity/OddEntity';
import { StatusEntity } from './entity/StatusEntity';
export type * from './MovioddsOddsTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { MovioddsOddsEntityBase } from './MovioddsOddsEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
type DirectResult = {
    ok: false;
    err: any;
    status?: undefined;
    headers?: undefined;
    data?: undefined;
} | {
    ok: boolean;
    status: number;
    headers: any;
    data: any;
    err?: any;
};
declare class MovioddsOddsSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<DirectResult>;
    _rawRequest(fetchargs?: any): Promise<DirectResult>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    BetBuilder(entopts?: Record<string, any>): BetBuilderEntity;
    Odd(entopts?: Record<string, any>): OddEntity;
    Status(entopts?: Record<string, any>): StatusEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): MovioddsOddsSDK;
    tester(testopts?: any, sdkopts?: any): MovioddsOddsSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof MovioddsOddsSDK;
export { stdutil, config, BaseFeature, MovioddsOddsEntityBase, MovioddsOddsSDK, SDK, };
export type { DirectResult };
