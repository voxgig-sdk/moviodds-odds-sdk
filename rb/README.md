# MovioddsOdds Ruby SDK



The Ruby SDK for the MovioddsOdds API — an entity-oriented client using idiomatic Ruby conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `client.BetBuilder` — with named operations (`list`/`load`/`create`) instead of raw URL paths and query strings. Working with resources and verbs keeps call sites self-describing and reduces cognitive load.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to RubyGems. Install it from the
GitHub release tag (`rb/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/moviodds-odds-sdk/tags)), or
from a clone:

```bash
git clone https://github.com/voxgig-sdk/moviodds-odds-sdk
```

Then add it to your `Gemfile` by path, and run `bundle install`:

```ruby
gem "voxgig-sdk-moviodds-odds-sdk", path: "./moviodds-odds-sdk/rb"
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record. The client sends the API key in the `X-API-Key` header.

### 1. Create a client

```ruby
require_relative "MovioddsOdds_sdk"

client = MovioddsOddsSDK.new({
  "apikey" => ENV["MOVIODDS_ODDS_APIKEY"],
})
```

### 4. Create, update, and remove

```ruby
# create returns the ENTITY — call data_get for the created BetBuilder record.
created = client.BetBuilder.create({ "slips" => [] })

```


## Error handling

Entity operations raise on failure, so rescue them:

```ruby
begin
  odds = client.Odd.list({ "fi" => "example" })
rescue => err
  warn "list failed: #{err}"
end
```

`direct` does **not** raise — it returns the result hash. Branch on
`ok`; on failure `status` holds the HTTP status (for error responses) and
`err` holds a transport error, so read both defensively:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example_id" },
})

warn "request failed: #{result["err"] || "HTTP #{result["status"]}"}" unless result["ok"]
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example" },
})

if result["ok"]
  puts result["status"]  # 200
  puts result["data"]    # response body
else
  # On an HTTP error status there is no err (only a transport failure sets
  # it), so fall back to the status code.
  warn(result["err"] || "HTTP #{result["status"]}")
end
```

### Prepare a request without sending it

```ruby
begin
  fetchdef = client.prepare({
    "path" => "/api/resource/{id}",
    "method" => "DELETE",
    "params" => { "id" => "example" },
  })
  puts fetchdef["url"]
  puts fetchdef["method"]
  puts fetchdef["headers"]
rescue => err
  warn "prepare failed: #{err}"
end
```

### Use test mode

Create a mock client for unit testing — no server required:

```ruby
client = MovioddsOddsSDK.test

# list returns an Array of Odd entities, one per mock record (raises on
# error); data_get reads each record.
odds = client.Odd.list({ "fi" => "example" })
odds.each { |item| puts item.data_get }
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```ruby
mock_fetch = ->(url, init) {
  return {
    "status" => 200,
    "statusText" => "OK",
    "headers" => {},
    "json" => ->() { { "id" => "mock01" } },
  }, nil
}

client = MovioddsOddsSDK.new({
  "base" => "http://localhost:8080",
  "system" => {
    "fetch" => mock_fetch,
  },
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
MOVIODDS_ODDS_TEST_LIVE=TRUE
MOVIODDS_ODDS_APIKEY=<your-key>
```

Then run:

```bash
cd rb && ruby -Itest -e "Dir['test/*_test.rb'].each { |f| require_relative f }"
```


## Reference

### MovioddsOddsSDK

```ruby
require_relative "MovioddsOdds_sdk"
client = MovioddsOddsSDK.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `String` | API key for authentication. |
| `base` | `String` | Base URL of the API server. |
| `prefix` | `String` | URL path prefix prepended to all requests. |
| `suffix` | `String` | URL path suffix appended to all requests. |
| `feature` | `Hash` | Feature activation flags. |
| `extend` | `Hash` | Additional Feature instances to load. |
| `system` | `Hash` | System overrides (e.g. custom `fetch` lambda). |

### test

```ruby
client = MovioddsOddsSDK.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### MovioddsOddsSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> Hash` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> Hash` | Build an HTTP request definition without sending. Raises on error. |
| `direct` | `(fetchargs) -> Hash` | Build and send an HTTP request. Returns a result hash (`result["ok"]`); does not raise. |
| `BetBuilder` | `(data) -> BetBuilderEntity` | Create a BetBuilder entity instance. |
| `Odd` | `(data) -> OddEntity` | Create an Odd entity instance. |
| `Status` | `(data) -> StatusEntity` | Create a Status entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any` | Load a single entity by match criteria, and return it. Raises on error. |
| `list` | `(reqmatch = nil, ctrl) -> Array` | List entities matching the criteria (call with no argument to list all), one per record. Raises on error. |
| `create` | `(reqdata, ctrl) -> any` | Create a new entity, and return it. Raises on error. |
| `data_get` | `() -> Hash` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> Hash` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> String` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` an `Array` of entities, one
per record; an entity's `data_get` reads its record. On failure they raise a
`MovioddsOddsError` (a `StandardError` subclass), so wrap calls in
`begin`/`rescue` where you need to handle errors.

The `direct` escape hatch is the exception: it never raises and instead
returns a result `Hash` with these keys:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `Boolean` | `true` if the HTTP status is 2xx. |
| `status` | `Integer` | HTTP status code. |
| `headers` | `Hash` | Response headers. |
| `data` | `any` | Parsed JSON response body. |
| `err` | `Error` | Present when `ok` is `false`. |

### Entities

#### BetBuilder

| Field | Description |
| --- | --- |
| `results` |  |
| `server_time` |  |
| `slips` |  |

Operations: Create.

API path: `/betbuilder/price`

#### Odd

| Field | Description |
| --- | --- |
| `away` |  |
| `class_id` | bet365 class id (F1 10, golf 7, cycling 38, American football 12, baseball 16, ice hockey 17, basketball 18, rugby union 8, rugby league 19, Australian rules 36). |
| `count` | Number of quotes. |
| `event_id` | bet365 event id (the drilled body's EV FI). |
| `event_name` | Event name, e.g. |
| `final_score` | The last scoreline seen (aggregate home-away; a comma-separated set list for set sports; for cricket bet365's Australian wickets/runs per innings in batting order, for example 7/199,8/141). |
| `finished_at` | The last instant the match was seen live (≈ when it finished). |
| `fixture` |  |
| `fixture_id` | The id that recorded this point. |
| `group_id` |  |
| `group_name` | Market display name (same as /odds). |
| `groups` | Number of markets. |
| `handicap` | The handicap where applicable; same field as /odds. |
| `home` |  |
| `id` | bet365 match id. |
| `in_play` | True while the match is actually under way. |
| `kickoff_estimated` | True when kickoff_utc is not bet365's scheduled start but an estimate derived from the live feed (the instant the match was first seen live), used only when the real start is unknown. |
| `kickoff_utc` | The match's scheduled kickoff (UTC). |
| `label` |  |
| `last` | One recorded price. |
| `last_seen` |  |
| `league` |  |
| `line` | The market line where applicable (e.g. |
| `links` | Ready-made bet365 deep links. |
| `market_count` | Markets priced for this match (unaffected by the groups filter). |
| `market_id` |  |
| `markets` |  |
| `n2` | Second participant where the market names one; same field as /odds. |
| `note` | A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,… |
| `odds_dec` |  |
| `odds_frac` | Derived display fraction; odds_dec is authoritative. |
| `overtime` | Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it. |
| `periods` | Per-period / per-set scores where the sport exposes them. |
| `polled_at` | When this match was last refreshed. |
| `pre_close` | One recorded price. |
| `quotes` |  |
| `region` |  |
| `score` | Live scoreline while in play, home-away. |
| `sel_id` |  |
| `server_time` |  |
| `side` | Selection side where the market uses one (e.g. |
| `sport` |  |
| `status` | finished: the match reached full time (a player or side won the required sets, baseball reached the 9th inning, or a cricket run result was derived). |
| `suspended` |  |
| `ts` |  |
| `updated_at` |  |

Operations: List, Load.

API path: `/closing`

#### Status

| Field | Description |
| --- | --- |
| `cache_fixtures` |  |
| `cache_quotes` |  |
| `catalog_fixtures` |  |
| `last_change_unix` |  |
| `last_fixture_seen_by_sport` | Per sport, the most recent time a fixture for that sport was seen in a catalog sweep. |
| `status` |  |
| `warming` | True right after a restart while the board loads. |

Operations: Load.

API path: `/health`



## Entities


### BetBuilder

Create an instance: `bet_builder = client.BetBuilder`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `results` | `Array` |  |
| `server_time` | `String` |  |
| `slips` | `Array` |  |

#### Example: Create

```ruby
bet_builder = client.BetBuilder.create({
  "slips" => [], # Array
})
```


### Odd

Create an instance: `odd = client.Odd`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `away` | `String` |  |
| `class_id` | `String` | bet365 class id (F1 10, golf 7, cycling 38, American football 12, baseball 16, ice hockey 17, basketball 18, rugby union 8, rugby league 19, Australian rules 36). |
| `count` | `Integer` | Number of quotes. |
| `event_id` | `String` | bet365 event id (the drilled body's EV FI). |
| `event_name` | `String` | Event name, e.g. |
| `final_score` | `String` | The last scoreline seen (aggregate home-away; a comma-separated set list for set sports; for cricket bet365's Australian wickets/runs per innings in batting order, for example 7/199,8/141). |
| `finished_at` | `String` | The last instant the match was seen live (≈ when it finished). |
| `fixture` | `String` |  |
| `fixture_id` | `String` | The id that recorded this point. |
| `group_id` | `String` |  |
| `group_name` | `String` | Market display name (same as /odds). |
| `groups` | `Integer` | Number of markets. |
| `handicap` | `String` | The handicap where applicable; same field as /odds. |
| `home` | `String` |  |
| `id` | `String` | bet365 match id. |
| `in_play` | `Boolean` | True while the match is actually under way. |
| `kickoff_estimated` | `Boolean` | True when kickoff_utc is not bet365's scheduled start but an estimate derived from the live feed (the instant the match was first seen live), used only when the real start is unknown. |
| `kickoff_utc` | `String` | The match's scheduled kickoff (UTC). |
| `label` | `String` |  |
| `last` | `Hash` | One recorded price. |
| `last_seen` | `String` |  |
| `league` | `String` |  |
| `line` | `String` | The market line where applicable (e.g. |
| `links` | `Hash` | Ready-made bet365 deep links. |
| `market_count` | `Integer` | Markets priced for this match (unaffected by the groups filter). |
| `market_id` | `String` |  |
| `markets` | `Array` |  |
| `n2` | `String` | Second participant where the market names one; same field as /odds. |
| `note` | `String` | A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,… |
| `odds_dec` | `Float` |  |
| `odds_frac` | `String` | Derived display fraction; odds_dec is authoritative. |
| `overtime` | `Boolean` | Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it. |
| `periods` | `Array` | Per-period / per-set scores where the sport exposes them. |
| `polled_at` | `String` | When this match was last refreshed. |
| `pre_close` | `Hash` | One recorded price. |
| `quotes` | `Object` |  |
| `region` | `String` |  |
| `score` | `String` | Live scoreline while in play, home-away. |
| `sel_id` | `String` |  |
| `server_time` | `String` |  |
| `side` | `String` | Selection side where the market uses one (e.g. |
| `sport` | `String` |  |
| `status` | `String` | finished: the match reached full time (a player or side won the required sets, baseball reached the 9th inning, or a cricket run result was derived). |
| `suspended` | `Boolean` |  |
| `ts` | `String` |  |
| `updated_at` | `String` |  |

#### Example: Load

```ruby
# load returns the ENTITY — call data_get for the Odd record (raises on error).
odd = client.Odd.load({ "fi" => "fi" })
```

#### Example: List

```ruby
# list returns an Array of Odd entities, one per record (raises on error).
odds = client.Odd.list({ "fi" => "example" })
odds.each { |item| puts item.data_get }
```


### Status

Create an instance: `status = client.Status`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `cache_fixtures` | `Integer` |  |
| `cache_quotes` | `Integer` |  |
| `catalog_fixtures` | `Integer` |  |
| `last_change_unix` | `Integer` |  |
| `last_fixture_seen_by_sport` | `Hash` | Per sport, the most recent time a fixture for that sport was seen in a catalog sweep. |
| `status` | `String` |  |
| `warming` | `Boolean` | True right after a restart while the board loads. |

#### Example: Load

```ruby
# load returns the ENTITY — call data_get for the Status record (raises on error).
status = client.Status.load()
```

## Features

This SDK ships 4 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`ratelimit`](#ratelimit) | Rate limiting |
| [`retry`](#retry) | Retry |
| [`test`](#test) | Test transport |
| [`timeout`](#timeout) | Timeout |

> **Order matters for `ratelimit`, `retry`, `timeout`.** These wrap the
> transport, so each one wraps whatever is already installed: the order you
> activate them in IS the nesting order. Activating them as an ordered list
> rather than a map is what fixes that order.

### ratelimit

Rate limiting.

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

Set `feature.ratelimit.active` to enable it, then override any of the options above.

`ratelimit` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### retry

Retry.

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

Set `feature.retry.active` to enable it, then override any of the options above.

`retry` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.

### timeout

Timeout.

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

Set `feature.timeout.active` to enable it, then override any of the options above.

`timeout` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is a Ruby class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as hashes

The Ruby SDK uses plain Ruby hashes throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `Helpers.to_map()` to safely validate that a value is a hash.

### Module structure

```
rb/
├── MovioddsOdds_sdk.rb       -- Main SDK module
├── config.rb                  -- Configuration
├── schema.rb                  -- Generated option + entity specs
├── features.rb                -- Feature factory
├── core/                      -- Core types and context
├── entity/                    -- Entity implementations
├── feature/                   -- Built-in features (Base, Test, Log)
├── utility/                   -- Utility functions and struct library
└── test/                      -- Test suites
```

The main module (`MovioddsOdds_sdk`) exports the SDK class
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```ruby
odd = client.Odd
odd.list({ "fi" => "example" })

# odd.data_get now returns the odd data from the last list
# odd.match_get returns the last match criteria
```

Call `make` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
