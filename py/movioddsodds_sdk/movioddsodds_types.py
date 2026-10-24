# Typed models for the MovioddsOdds SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class BetBuilder(TypedDict):
    results: list
    server_time: str
    slips: list


class BetBuilderCreateData(TypedDict):
    slips: list


class OddRequired(TypedDict):
    class_id: str
    count: int
    event_id: str
    fixture: str
    groups: int
    id: str
    in_play: bool
    last: dict
    market_count: int
    markets: list
    odds_dec: float
    pre_close: dict
    sel_id: str
    server_time: str
    suspended: bool
    ts: str


class Odd(OddRequired, total=False):
    away: str
    event_name: str
    final_score: str
    finished_at: str
    fixture_id: str
    group_id: str
    group_name: str
    handicap: str
    home: str
    kickoff_estimated: bool
    kickoff_utc: str
    label: str
    last_seen: str
    league: str
    line: str
    links: dict
    market_id: str
    n2: str
    note: str
    odds_frac: str
    overtime: bool
    periods: list
    polled_at: str
    quotes: list | None
    region: str
    score: str
    side: str
    sport: str
    status: str
    updated_at: str


class OddLoadMatch(TypedDict):
    fi: str


class OddListMatch(TypedDict):
    fi: str


class Status(TypedDict, total=False):
    cache_fixtures: int
    cache_quotes: int
    catalog_fixtures: int
    last_change_unix: int
    last_fixture_seen_by_sport: dict
    status: str
    warming: bool


class StatusLoadMatch(TypedDict, total=False):
    cache_fixtures: int
    cache_quotes: int
    catalog_fixtures: int
    last_change_unix: int
    last_fixture_seen_by_sport: dict
    status: str
    warming: bool
