<?php
declare(strict_types=1);

// Typed models for the MovioddsOdds SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** BetBuilder entity data model. */
class BetBuilder
{
    public array $results;
    public string $server_time;
    public array $slips;
}

/** Request payload for BetBuilder#create. */
class BetBuilderCreateData
{
    public array $slips;
}

/** Odd entity data model. */
class Odd
{
    public ?string $away = null;
    public string $class_id;
    public int $count;
    public string $event_id;
    public ?string $event_name = null;
    public ?string $final_score = null;
    public ?string $finished_at = null;
    public string $fixture;
    public ?string $fixture_id = null;
    public ?string $group_id = null;
    public ?string $group_name = null;
    public int $groups;
    public ?string $handicap = null;
    public ?string $home = null;
    public string $id;
    public bool $in_play;
    public ?bool $kickoff_estimated = null;
    public ?string $kickoff_utc = null;
    public ?string $label = null;
    public array $last;
    public ?string $last_seen = null;
    public ?string $league = null;
    public ?string $line = null;
    public ?array $links = null;
    public int $market_count;
    public ?string $market_id = null;
    public array $markets;
    public ?string $n2 = null;
    public ?string $note = null;
    public float $odds_dec;
    public ?string $odds_frac = null;
    public ?bool $overtime = null;
    public ?array $periods = null;
    public ?string $polled_at = null;
    public array $pre_close;
    public mixed $quotes = null;
    public ?string $region = null;
    public ?string $score = null;
    public string $sel_id;
    public string $server_time;
    public ?string $side = null;
    public ?string $sport = null;
    public ?string $status = null;
    public bool $suspended;
    public string $ts;
    public ?string $updated_at = null;
}

/** Request payload for Odd#load. */
class OddLoadMatch
{
    public string $fi;
}

/** Request payload for Odd#list. */
class OddListMatch
{
    public string $fi;
}

/** Status entity data model. */
class Status
{
    public ?int $cache_fixtures = null;
    public ?int $cache_quotes = null;
    public ?int $catalog_fixtures = null;
    public ?int $last_change_unix = null;
    public ?array $last_fixture_seen_by_sport = null;
    public ?string $status = null;
    public ?bool $warming = null;
}

/** Request payload for Status#load. */
class StatusLoadMatch
{
    public ?int $cache_fixtures = null;
    public ?int $cache_quotes = null;
    public ?int $catalog_fixtures = null;
    public ?int $last_change_unix = null;
    public ?array $last_fixture_seen_by_sport = null;
    public ?string $status = null;
    public ?bool $warming = null;
}

