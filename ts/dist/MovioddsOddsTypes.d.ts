export interface BetBuilder {
    results: any[];
    server_time: string;
    slips: any[];
}
export interface BetBuilderCreateData {
    slips: any[];
}
export interface Odd {
    away?: string;
    class_id: string;
    count: number;
    event_id: string;
    event_name?: string;
    final_score?: string;
    finished_at?: string;
    fixture: string;
    fixture_id?: string;
    group_id?: string;
    group_name?: string;
    groups: number;
    handicap?: string;
    home?: string;
    id: string;
    in_play: boolean;
    kickoff_estimated?: boolean;
    kickoff_utc?: string;
    label?: string;
    last: Record<string, any>;
    last_seen?: string;
    league?: string;
    line?: string;
    links?: Record<string, any>;
    market_count: number;
    market_id?: string;
    markets: any[];
    n2?: string;
    note?: string;
    odds_dec: number;
    odds_frac?: string;
    overtime?: boolean;
    periods?: any[];
    polled_at?: string;
    pre_close: Record<string, any>;
    quotes?: any[] | null;
    region?: string;
    score?: string;
    sel_id: string;
    server_time: string;
    side?: string;
    sport?: string;
    status?: string;
    suspended: boolean;
    ts: string;
    updated_at?: string;
}
export interface OddLoadMatch {
    fi: string;
}
export interface OddListMatch {
    fi: string;
}
export interface Status {
    cache_fixtures?: number;
    cache_quotes?: number;
    catalog_fixtures?: number;
    last_change_unix?: number;
    last_fixture_seen_by_sport?: Record<string, any>;
    status?: string;
    warming?: boolean;
}
export interface StatusLoadMatch {
    cache_fixtures?: number;
    cache_quotes?: number;
    catalog_fixtures?: number;
    last_change_unix?: number;
    last_fixture_seen_by_sport?: Record<string, any>;
    status?: string;
    warming?: boolean;
}
