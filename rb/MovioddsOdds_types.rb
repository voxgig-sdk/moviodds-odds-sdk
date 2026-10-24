# frozen_string_literal: true

# Typed models for the MovioddsOdds SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# BetBuilder entity data model.
#
# @!attribute [rw] results
#   @return [Array]
#
# @!attribute [rw] server_time
#   @return [String]
#
# @!attribute [rw] slips
#   @return [Array]
BetBuilder = Struct.new(
  :results,
  :server_time,
  :slips,
  keyword_init: true
)

# Request payload for BetBuilder#create.
#
# @!attribute [rw] slips
#   @return [Array]
BetBuilderCreateData = Struct.new(
  :slips,
  keyword_init: true
)

# Odd entity data model.
#
# @!attribute [rw] away
#   @return [String, nil]
#
# @!attribute [rw] class_id
#   @return [String]
#
# @!attribute [rw] count
#   @return [Integer]
#
# @!attribute [rw] event_id
#   @return [String]
#
# @!attribute [rw] event_name
#   @return [String, nil]
#
# @!attribute [rw] final_score
#   @return [String, nil]
#
# @!attribute [rw] finished_at
#   @return [String, nil]
#
# @!attribute [rw] fixture
#   @return [String]
#
# @!attribute [rw] fixture_id
#   @return [String, nil]
#
# @!attribute [rw] group_id
#   @return [String, nil]
#
# @!attribute [rw] group_name
#   @return [String, nil]
#
# @!attribute [rw] groups
#   @return [Integer]
#
# @!attribute [rw] handicap
#   @return [String, nil]
#
# @!attribute [rw] home
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] in_play
#   @return [Boolean]
#
# @!attribute [rw] kickoff_estimated
#   @return [Boolean, nil]
#
# @!attribute [rw] kickoff_utc
#   @return [String, nil]
#
# @!attribute [rw] label
#   @return [String, nil]
#
# @!attribute [rw] last
#   @return [Hash]
#
# @!attribute [rw] last_seen
#   @return [String, nil]
#
# @!attribute [rw] league
#   @return [String, nil]
#
# @!attribute [rw] line
#   @return [String, nil]
#
# @!attribute [rw] links
#   @return [Hash, nil]
#
# @!attribute [rw] market_count
#   @return [Integer]
#
# @!attribute [rw] market_id
#   @return [String, nil]
#
# @!attribute [rw] markets
#   @return [Array]
#
# @!attribute [rw] n2
#   @return [String, nil]
#
# @!attribute [rw] note
#   @return [String, nil]
#
# @!attribute [rw] odds_dec
#   @return [Float]
#
# @!attribute [rw] odds_frac
#   @return [String, nil]
#
# @!attribute [rw] overtime
#   @return [Boolean, nil]
#
# @!attribute [rw] periods
#   @return [Array, nil]
#
# @!attribute [rw] polled_at
#   @return [String, nil]
#
# @!attribute [rw] pre_close
#   @return [Hash]
#
# @!attribute [rw] quotes
#   @return [Object, nil]
#
# @!attribute [rw] region
#   @return [String, nil]
#
# @!attribute [rw] score
#   @return [String, nil]
#
# @!attribute [rw] sel_id
#   @return [String]
#
# @!attribute [rw] server_time
#   @return [String]
#
# @!attribute [rw] side
#   @return [String, nil]
#
# @!attribute [rw] sport
#   @return [String, nil]
#
# @!attribute [rw] status
#   @return [String, nil]
#
# @!attribute [rw] suspended
#   @return [Boolean]
#
# @!attribute [rw] ts
#   @return [String]
#
# @!attribute [rw] updated_at
#   @return [String, nil]
Odd = Struct.new(
  :away,
  :class_id,
  :count,
  :event_id,
  :event_name,
  :final_score,
  :finished_at,
  :fixture,
  :fixture_id,
  :group_id,
  :group_name,
  :groups,
  :handicap,
  :home,
  :id,
  :in_play,
  :kickoff_estimated,
  :kickoff_utc,
  :label,
  :last,
  :last_seen,
  :league,
  :line,
  :links,
  :market_count,
  :market_id,
  :markets,
  :n2,
  :note,
  :odds_dec,
  :odds_frac,
  :overtime,
  :periods,
  :polled_at,
  :pre_close,
  :quotes,
  :region,
  :score,
  :sel_id,
  :server_time,
  :side,
  :sport,
  :status,
  :suspended,
  :ts,
  :updated_at,
  keyword_init: true
)

# Request payload for Odd#load.
#
# @!attribute [rw] fi
#   @return [String]
OddLoadMatch = Struct.new(
  :fi,
  keyword_init: true
)

# Request payload for Odd#list.
#
# @!attribute [rw] fi
#   @return [String]
OddListMatch = Struct.new(
  :fi,
  keyword_init: true
)

# Status entity data model.
#
# @!attribute [rw] cache_fixtures
#   @return [Integer, nil]
#
# @!attribute [rw] cache_quotes
#   @return [Integer, nil]
#
# @!attribute [rw] catalog_fixtures
#   @return [Integer, nil]
#
# @!attribute [rw] last_change_unix
#   @return [Integer, nil]
#
# @!attribute [rw] last_fixture_seen_by_sport
#   @return [Hash, nil]
#
# @!attribute [rw] status
#   @return [String, nil]
#
# @!attribute [rw] warming
#   @return [Boolean, nil]
Status = Struct.new(
  :cache_fixtures,
  :cache_quotes,
  :catalog_fixtures,
  :last_change_unix,
  :last_fixture_seen_by_sport,
  :status,
  :warming,
  keyword_init: true
)

# Request payload for Status#load.
#
# @!attribute [rw] cache_fixtures
#   @return [Integer, nil]
#
# @!attribute [rw] cache_quotes
#   @return [Integer, nil]
#
# @!attribute [rw] catalog_fixtures
#   @return [Integer, nil]
#
# @!attribute [rw] last_change_unix
#   @return [Integer, nil]
#
# @!attribute [rw] last_fixture_seen_by_sport
#   @return [Hash, nil]
#
# @!attribute [rw] status
#   @return [String, nil]
#
# @!attribute [rw] warming
#   @return [Boolean, nil]
StatusLoadMatch = Struct.new(
  :cache_fixtures,
  :cache_quotes,
  :catalog_fixtures,
  :last_change_unix,
  :last_fixture_seen_by_sport,
  :status,
  :warming,
  keyword_init: true
)

