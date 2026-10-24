# MovioddsOdds Lua SDK



The Lua SDK for the MovioddsOdds API — an entity-oriented client using Lua conventions.

It exposes the API as capitalised, semantic **Entities** — e.g. `client:BetBuilder()` — each with the same small set of operations (`list`, `load`, `create`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to LuaRocks. Install it from the
GitHub release tag (`lua/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/moviodds-odds-sdk/tags)),
or add the source directory to your `LUA_PATH`:

```bash
export LUA_PATH="path/to/lua/?.lua;path/to/lua/?/init.lua;;"
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record. The client sends the API key in the `X-API-Key` header.

### 1. Create a client

```lua
local sdk = require("moviodds-odds_sdk")

local client = sdk.new({
  apikey = os.getenv("MOVIODDS_ODDS_APIKEY"),
})
```

### 4. Create, update, and remove

```lua
-- Create
local created, err = client:BetBuilder():create({ slips = {} })
if err then error(err) end

```


## Error handling

Entity operations return `(value, err)`. Check `err` before using
the value:

```lua
local odds, err = client:Odd():list({ fi = "example" })
if err then error(err) end
```

`direct` follows the same `(value, err)` convention:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example_id" },
})
if err then error(err) end
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example" },
})
if err then error(err) end

if result["ok"] then
  print(result["status"])  -- 200
  print(result["data"])    -- response body
end
```

### Prepare a request without sending it

```lua
local fetchdef, err = client:prepare({
  path = "/api/resource/{id}",
  method = "DELETE",
  params = { id = "example" },
})
if err then error(err) end

print(fetchdef["url"])
print(fetchdef["method"])
print(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```lua
local client = sdk.test()

local result, err = client:Odd():list({ fi = "example" })
-- result is an array of entities, one per mock record; err is set on failure
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```lua
local function mock_fetch(url, init)
  return {
    status = 200,
    statusText = "OK",
    headers = {},
    json = function()
      return { id = "mock01" }
    end,
  }, nil
end

local client = sdk.new({
  base = "http://localhost:8080",
  system = {
    fetch = mock_fetch,
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
cd lua && busted test/
```


## Reference

### MovioddsOddsSDK

```lua
local sdk = require("moviodds-odds_sdk")
local client = sdk.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `table` | Feature activation flags. |
| `extend` | `table` | Additional Feature instances to load. |
| `system` | `table` | System overrides (e.g. custom `fetch` function). |

### test

```lua
local client = sdk.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### MovioddsOddsSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> table` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> table, err` | Build an HTTP request definition without sending. |
| `direct` | `(fetchargs) -> table, err` | Build and send an HTTP request. |
| `BetBuilder` | `(data) -> BetBuilderEntity` | Create a BetBuilder entity instance. |
| `Odd` | `(data) -> OddEntity` | Create an Odd entity instance. |
| `Status` | `(data) -> StatusEntity` | Create a Status entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any, err` | Load a single entity by match criteria, and return it. |
| `list` | `(reqmatch, ctrl) -> any, err` | List entities matching the criteria, one per record. |
| `create` | `(reqdata, ctrl) -> any, err` | Create a new entity, and return it. |
| `data_get` | `() -> table` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> table` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> string` | Return the entity name. |

### Result shape

Entity operations return `(value, err)`. The `value` is the entity
itself — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `load` / `create` | the entity, whose `data_get()` reads its record (a `table`) |
| `list` | an array (`table`) of entities, one per record |

Check `err` first (it is non-`nil` on failure), then use `value`:

    local odd, err = client:Odd():load({ fi = "example" })
    if err then error(err) end
    -- odd is the loaded entity

Only `direct()` returns a response envelope — a `table` with `ok`,
`status`, `headers`, and `data` keys.

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

Create an instance: `local bet_builder = client:BetBuilder(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `results` | `table` |  |
| `server_time` | `string` |  |
| `slips` | `table` |  |

#### Example: Create

```lua
local bet_builder, err = client:BetBuilder():create({
  slips = {}, -- table
})
```


### Odd

Create an instance: `local odd = client:Odd(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `away` | `string` |  |
| `class_id` | `string` | bet365 class id (F1 10, golf 7, cycling 38, American football 12, baseball 16, ice hockey 17, basketball 18, rugby union 8, rugby league 19, Australian rules 36). |
| `count` | `number` | Number of quotes. |
| `event_id` | `string` | bet365 event id (the drilled body's EV FI). |
| `event_name` | `string` | Event name, e.g. |
| `final_score` | `string` | The last scoreline seen (aggregate home-away; a comma-separated set list for set sports; for cricket bet365's Australian wickets/runs per innings in batting order, for example 7/199,8/141). |
| `finished_at` | `string` | The last instant the match was seen live (≈ when it finished). |
| `fixture` | `string` |  |
| `fixture_id` | `string` | The id that recorded this point. |
| `group_id` | `string` |  |
| `group_name` | `string` | Market display name (same as /odds). |
| `groups` | `number` | Number of markets. |
| `handicap` | `string` | The handicap where applicable; same field as /odds. |
| `home` | `string` |  |
| `id` | `string` | bet365 match id. |
| `in_play` | `boolean` | True while the match is actually under way. |
| `kickoff_estimated` | `boolean` | True when kickoff_utc is not bet365's scheduled start but an estimate derived from the live feed (the instant the match was first seen live), used only when the real start is unknown. |
| `kickoff_utc` | `string` | The match's scheduled kickoff (UTC). |
| `label` | `string` |  |
| `last` | `table` | One recorded price. |
| `last_seen` | `string` |  |
| `league` | `string` |  |
| `line` | `string` | The market line where applicable (e.g. |
| `links` | `table` | Ready-made bet365 deep links. |
| `market_count` | `number` | Markets priced for this match (unaffected by the groups filter). |
| `market_id` | `string` |  |
| `markets` | `table` |  |
| `n2` | `string` | Second participant where the market names one; same field as /odds. |
| `note` | `string` | A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,… |
| `odds_dec` | `number` |  |
| `odds_frac` | `string` | Derived display fraction; odds_dec is authoritative. |
| `overtime` | `boolean` | Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it. |
| `periods` | `table` | Per-period / per-set scores where the sport exposes them. |
| `polled_at` | `string` | When this match was last refreshed. |
| `pre_close` | `table` | One recorded price. |
| `quotes` | `table|nil` |  |
| `region` | `string` |  |
| `score` | `string` | Live scoreline while in play, home-away. |
| `sel_id` | `string` |  |
| `server_time` | `string` |  |
| `side` | `string` | Selection side where the market uses one (e.g. |
| `sport` | `string` |  |
| `status` | `string` | finished: the match reached full time (a player or side won the required sets, baseball reached the 9th inning, or a cricket run result was derived). |
| `suspended` | `boolean` |  |
| `ts` | `string` |  |
| `updated_at` | `string` |  |

#### Example: Load

```lua
local odd, err = client:Odd():load({ fi = "fi" })
```

#### Example: List

```lua
local odds, err = client:Odd():list({ fi = "example" })
```


### Status

Create an instance: `local status = client:Status(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `cache_fixtures` | `number` |  |
| `cache_quotes` | `number` |  |
| `catalog_fixtures` | `number` |  |
| `last_change_unix` | `number` |  |
| `last_fixture_seen_by_sport` | `table` | Per sport, the most recent time a fixture for that sport was seen in a catalog sweep. |
| `status` | `string` |  |
| `warming` | `boolean` | True right after a restart while the board loads. |

#### Example: Load

```lua
local status, err = client:Status():load()
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

Features are the extension mechanism. A feature is a Lua table
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as tables

The Lua SDK uses plain Lua tables throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `helpers.to_map()` to safely validate that a value is a table.

### Module structure

```
lua/
├── moviodds-odds_sdk.lua    -- Main SDK module
├── config.lua               -- Configuration
├── schema.lua               -- Generated option + entity specs
├── features.lua             -- Feature factory
├── core/                    -- Core types and context
├── entity/                  -- Entity implementations
├── feature/                 -- Built-in features (Base, Test, Log)
├── utility/                 -- Utility functions and struct library
└── test/                    -- Test suites
```

The main module (`moviodds-odds_sdk`) exports the SDK constructor
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```lua
local odd = client:Odd()
odd:list({ fi = "example" })

-- odd:data_get() now returns the odd data from the last list
-- odd:match_get() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
