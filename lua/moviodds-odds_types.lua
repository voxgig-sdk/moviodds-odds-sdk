-- Typed models for the MovioddsOdds SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
-- params (op.<name>.points[].g.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class BetBuilder
---@field results table
---@field server_time string
---@field slips table

---@class BetBuilderCreateData
---@field slips table

---@class Odd
---@field away? string
---@field class_id string
---@field count number
---@field event_id string
---@field event_name? string
---@field final_score? string
---@field finished_at? string
---@field fixture string
---@field fixture_id? string
---@field group_id? string
---@field group_name? string
---@field groups number
---@field handicap? string
---@field home? string
---@field id string
---@field in_play boolean
---@field kickoff_estimated? boolean
---@field kickoff_utc? string
---@field label? string
---@field last table
---@field last_seen? string
---@field league? string
---@field line? string
---@field links? table
---@field market_count number
---@field market_id? string
---@field markets table
---@field n2? string
---@field note? string
---@field odds_dec number
---@field odds_frac? string
---@field overtime? boolean
---@field periods? table
---@field polled_at? string
---@field pre_close table
---@field quotes? table|nil
---@field region? string
---@field score? string
---@field sel_id string
---@field server_time string
---@field side? string
---@field sport? string
---@field status? string
---@field suspended boolean
---@field ts string
---@field updated_at? string

---@class OddLoadMatch
---@field fi string

---@class OddListMatch
---@field fi string

---@class Status
---@field cache_fixtures? number
---@field cache_quotes? number
---@field catalog_fixtures? number
---@field last_change_unix? number
---@field last_fixture_seen_by_sport? table
---@field status? string
---@field warming? boolean

---@class StatusLoadMatch
---@field cache_fixtures? number
---@field cache_quotes? number
---@field catalog_fixtures? number
---@field last_change_unix? number
---@field last_fixture_seen_by_sport? table
---@field status? string
---@field warming? boolean

local M = {}

return M
