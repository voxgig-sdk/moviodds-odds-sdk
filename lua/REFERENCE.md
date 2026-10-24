# MovioddsOdds Lua SDK Reference

Complete API reference for the MovioddsOdds Lua SDK.


## MovioddsOddsSDK

### Constructor

```lua
local sdk = require("moviodds-odds_sdk")
local client = sdk.new(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `table` | SDK configuration options. |
| `options.apikey` | `string` | API key for authentication. |
| `options.base` | `string` | Base URL for API requests. |
| `options.prefix` | `string` | URL prefix appended after base. |
| `options.suffix` | `string` | URL suffix appended after path. |
| `options.headers` | `table` | Custom headers for all requests. |
| `options.feature` | `table` | Feature configuration. |
| `options.system` | `table` | System overrides (e.g. custom fetch). |


### Static Methods

#### `sdk.test(testopts?, sdkopts?)`

Create a test client with mock features active. Both arguments are optional.

```lua
local client = sdk.test()
```


### Instance Methods

#### `BetBuilder(data)`

Create a new `BetBuilder` entity instance. Pass `nil` for no initial data.

#### `Odd(data)`

Create a new `Odd` entity instance. Pass `nil` for no initial data.

#### `Status(data)`

Create a new `Status` entity instance. Pass `nil` for no initial data.

#### `options_map() -> table`

Return a deep copy of the current SDK options.

#### `get_utility() -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs) -> table, err`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs.path` | `string` | URL path with optional `{param}` placeholders. |
| `fetchargs.method` | `string` | HTTP method (default: `"GET"`). |
| `fetchargs.params` | `table` | Path parameter values for `{param}` substitution. |
| `fetchargs.query` | `table` | Query string parameters. |
| `fetchargs.headers` | `table` | Request headers (merged with defaults). |
| `fetchargs.body` | `any` | Request body (tables are JSON-serialized). |
| `fetchargs.ctrl` | `table` | Control options (e.g. `{ explain = true }`). |

**Returns:** `table, err`

#### `prepare(fetchargs) -> table, err`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`.

**Returns:** `table, err`


---

## BetBuilderEntity

```lua
local bet_builder = client:BetBuilder(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `results` | `table` | Yes |  |
| `server_time` | `string` | Yes |  |
| `slips` | `table` | Yes |  |

### Operations

#### `create(reqdata, ctrl) -> any, err`

Create a new entity with the given data. Returns the created entity, or `nil` and an error on failure.

```lua
local result, err = client:BetBuilder():create({
  slips = --[[ table ]],
})
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `BetBuilderEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## OddEntity

```lua
local odd = client:Odd(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `away` | `string` | No |  |
| `class_id` | `string` | Yes | bet365 class id (F1 10, golf 7, cycling 38, American football 12, baseball 16, ice hockey 17, basketball 18, rugby union 8, rugby league 19, Australian rules 36). |
| `count` | `number` | Yes | Number of quotes. |
| `event_id` | `string` | Yes | bet365 event id (the drilled body's EV FI). |
| `event_name` | `string` | No | Event name, e.g. |
| `final_score` | `string` | No | The last scoreline seen (aggregate home-away; a comma-separated set list for set sports; for cricket bet365's Australian wickets/runs per innings in batting order, for example 7/199,8/141). |
| `finished_at` | `string` | No | The last instant the match was seen live (≈ when it finished). |
| `fixture` | `string` | Yes |  |
| `fixture_id` | `string` | No | The id that recorded this point. |
| `group_id` | `string` | No |  |
| `group_name` | `string` | No | Market display name (same as /odds). |
| `groups` | `number` | Yes | Number of markets. |
| `handicap` | `string` | No | The handicap where applicable; same field as /odds. |
| `home` | `string` | No |  |
| `id` | `string` | Yes | bet365 match id. |
| `in_play` | `boolean` | Yes | True while the match is actually under way. |
| `kickoff_estimated` | `boolean` | No | True when kickoff_utc is not bet365's scheduled start but an estimate derived from the live feed (the instant the match was first seen live), used only when the real start is unknown. |
| `kickoff_utc` | `string` | No | The match's scheduled kickoff (UTC). |
| `label` | `string` | No |  |
| `last` | `table` | Yes | One recorded price. |
| `last_seen` | `string` | No |  |
| `league` | `string` | No |  |
| `line` | `string` | No | The market line where applicable (e.g. |
| `links` | `table` | No | Ready-made bet365 deep links. |
| `market_count` | `number` | Yes | Markets priced for this match (unaffected by the groups filter). |
| `market_id` | `string` | No |  |
| `markets` | `table` | Yes |  |
| `n2` | `string` | No | Second participant where the market names one; same field as /odds. |
| `note` | `string` | No | A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,… |
| `odds_dec` | `number` | Yes |  |
| `odds_frac` | `string` | No | Derived display fraction; odds_dec is authoritative. |
| `overtime` | `boolean` | No | Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it. |
| `periods` | `table` | No | Per-period / per-set scores where the sport exposes them. |
| `polled_at` | `string` | No | When this match was last refreshed. |
| `pre_close` | `table` | Yes | One recorded price. |
| `quotes` | `table|nil` | No |  |
| `region` | `string` | No |  |
| `score` | `string` | No | Live scoreline while in play, home-away. |
| `sel_id` | `string` | Yes |  |
| `server_time` | `string` | Yes |  |
| `side` | `string` | No | Selection side where the market uses one (e.g. |
| `sport` | `string` | No |  |
| `status` | `string` | No | finished: the match reached full time (a player or side won the required sets, baseball reached the 9th inning, or a cricket run result was derived). |
| `suspended` | `boolean` | Yes |  |
| `ts` | `string` | Yes |  |
| `updated_at` | `string` | No |  |

### Field Usage by Operation

| Field | load | list |
| --- | --- | --- |
| `away` | - | Yes |
| `class_id` | - | - |
| `count` | - | - |
| `event_id` | - | - |
| `event_name` | - | - |
| `final_score` | - | - |
| `finished_at` | - | - |
| `fixture` | - | - |
| `fixture_id` | - | - |
| `group_id` | - | - |
| `group_name` | - | - |
| `groups` | - | - |
| `handicap` | - | - |
| `home` | - | Yes |
| `id` | - | - |
| `in_play` | - | - |
| `kickoff_estimated` | - | - |
| `kickoff_utc` | - | - |
| `label` | - | - |
| `last` | - | - |
| `last_seen` | - | - |
| `league` | - | - |
| `line` | - | - |
| `links` | - | - |
| `market_count` | - | - |
| `market_id` | - | - |
| `markets` | - | - |
| `n2` | - | - |
| `note` | - | - |
| `odds_dec` | - | - |
| `odds_frac` | - | - |
| `overtime` | - | - |
| `periods` | - | - |
| `polled_at` | - | - |
| `pre_close` | - | - |
| `quotes` | - | Yes |
| `region` | - | - |
| `score` | - | - |
| `sel_id` | - | Yes |
| `server_time` | - | - |
| `side` | - | - |
| `sport` | - | Yes |
| `status` | - | - |
| `suspended` | - | - |
| `ts` | - | - |
| `updated_at` | - | - |

### Operations

#### `list(reqmatch, ctrl) -> any, err`

List entities matching the given criteria. Returns an array of entities, one per record, or `nil` and an error on failure.

```lua
local results, err = client:Odd():list({ fi = "example" })
```

#### `load(reqmatch, ctrl) -> any, err`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, or `nil` and an error on failure.

```lua
local result, err = client:Odd():load({ fi = "fi" })
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `OddEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## StatusEntity

```lua
local status = client:Status(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `cache_fixtures` | `number` | No |  |
| `cache_quotes` | `number` | No |  |
| `catalog_fixtures` | `number` | No |  |
| `last_change_unix` | `number` | No |  |
| `last_fixture_seen_by_sport` | `table` | No | Per sport, the most recent time a fixture for that sport was seen in a catalog sweep. |
| `status` | `string` | No |  |
| `warming` | `boolean` | No | True right after a restart while the board loads. |

### Operations

#### `load(reqmatch, ctrl) -> any, err`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, or `nil` and an error on failure.

```lua
local result, err = client:Status():load()
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `StatusEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `ratelimit` | 0.0.1 | Rate limiting |
| `retry` | 0.0.1 | Retry |
| `test` | 0.0.1 | Test transport |
| `timeout` | 0.0.1 | Timeout |


Features are activated via the `feature` option:

```lua
local client = sdk.new({
  feature = {
    ratelimit = { active = true },
    retry = { active = true },
    test = { active = true },
    timeout = { active = true },
  },
})
```


### Configuring features

Each feature is inactive until switched on, and an SDK with no feature
configured does no feature work at all. Every option below keeps its default
unless you name it.

The array form of \`feature\` is significant: several features wrap the
transport, and the order you list them in is the order they nest.

#### Ordering

`ratelimit`, `retry`, `timeout` wrap the transport. Each
wraps whatever is already installed, so **activation order is nesting order**:
a feature activated later sits OUTSIDE one activated earlier, and sees the call
first.

That decides behaviour, not just sequence: a feature that short-circuits the
call, such as a cache serving a hit, stops every feature nested inside it from
ever seeing that call.

`test` attach to pipeline hooks
rather than the transport, so their order does not affect what they observe.

#### `ratelimit`

Rate limiting.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

| Option | Type |
|---|---|
| `now` | function |
| `sleep` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.ratelimit.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

#### `retry`

Retry.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

| Option | Type |
|---|---|
| `jitter` | boolean |
| `sleep` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.retry.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

#### `test`

Test transport.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |

| Option | Type |
|---|---|
| `entity` | map |
| `net` | map |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.test.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Installs the BASE transport that the wrapping features wrap, so it must be
  activated before them.
- Inactive by default: leaving it out costs nothing at runtime.

#### `timeout`

Timeout.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

| Option | Type |
|---|---|
| `clearTimer` | function |
| `now` | function |
| `setTimer` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.timeout.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

