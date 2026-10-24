# MovioddsOdds Ruby SDK Reference

Complete API reference for the MovioddsOdds Ruby SDK.


## MovioddsOddsSDK

### Constructor

```ruby
require_relative 'MovioddsOdds_sdk'

client = MovioddsOddsSDK.new(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `Hash` | SDK configuration options. |
| `options["apikey"]` | `String` | API key for authentication. |
| `options["base"]` | `String` | Base URL for API requests. |
| `options["prefix"]` | `String` | URL prefix appended after base. |
| `options["suffix"]` | `String` | URL suffix appended after path. |
| `options["headers"]` | `Hash` | Custom headers for all requests. |
| `options["feature"]` | `Hash` | Feature configuration. |
| `options["system"]` | `Hash` | System overrides (e.g. custom fetch). |


### Static Methods

#### `MovioddsOddsSDK.test(testopts = nil, sdkopts = nil)`

Create a test client with mock features active. Both arguments may be `nil`.

```ruby
client = MovioddsOddsSDK.test
```


### Instance Methods

#### `BetBuilder(data = nil)`

Create a new `BetBuilder` entity instance. Pass `nil` for no initial data.

#### `Odd(data = nil)`

Create a new `Odd` entity instance. Pass `nil` for no initial data.

#### `Status(data = nil)`

Create a new `Status` entity instance. Pass `nil` for no initial data.

#### `options_map -> Hash`

Return a deep copy of the current SDK options.

#### `get_utility -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs = {}) -> Hash`

Make a direct HTTP request to any API endpoint. Returns a result hash
(`{ "ok" => ..., "status" => ..., "data" => ..., "err" => ... }`); it
does not raise — inspect `result["ok"]`.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs["path"]` | `String` | URL path with optional `{param}` placeholders. |
| `fetchargs["method"]` | `String` | HTTP method (default: `"GET"`). |
| `fetchargs["params"]` | `Hash` | Path parameter values for `{param}` substitution. |
| `fetchargs["query"]` | `Hash` | Query string parameters. |
| `fetchargs["headers"]` | `Hash` | Request headers (merged with defaults). |
| `fetchargs["body"]` | `any` | Request body (hashes are JSON-serialized). |
| `fetchargs["ctrl"]` | `Hash` | Control options (e.g. `{ "explain" => true }`). |

**Returns:** `Hash`

#### `prepare(fetchargs = {}) -> Hash`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`. Raises on error.

**Returns:** `Hash` (the fetch definition; raises on error)


---

## BetBuilderEntity

```ruby
bet_builder = client.BetBuilder
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `results` | `Array` | Yes |  |
| `server_time` | `String` | Yes |  |
| `slips` | `Array` | Yes |  |

### Operations

#### `create(reqdata, ctrl = nil) -> result`

Create a new entity with the given data. Returns the created entity and raises on error.

```ruby
result = client.BetBuilder.create({
  "slips" => [], # Array
})
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `BetBuilderEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## OddEntity

```ruby
odd = client.Odd
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `away` | `String` | No |  |
| `class_id` | `String` | Yes | bet365 class id (F1 10, golf 7, cycling 38, American football 12, baseball 16, ice hockey 17, basketball 18, rugby union 8, rugby league 19, Australian rules 36). |
| `count` | `Integer` | Yes | Number of quotes. |
| `event_id` | `String` | Yes | bet365 event id (the drilled body's EV FI). |
| `event_name` | `String` | No | Event name, e.g. |
| `final_score` | `String` | No | The last scoreline seen (aggregate home-away; a comma-separated set list for set sports; for cricket bet365's Australian wickets/runs per innings in batting order, for example 7/199,8/141). |
| `finished_at` | `String` | No | The last instant the match was seen live (≈ when it finished). |
| `fixture` | `String` | Yes |  |
| `fixture_id` | `String` | No | The id that recorded this point. |
| `group_id` | `String` | No |  |
| `group_name` | `String` | No | Market display name (same as /odds). |
| `groups` | `Integer` | Yes | Number of markets. |
| `handicap` | `String` | No | The handicap where applicable; same field as /odds. |
| `home` | `String` | No |  |
| `id` | `String` | Yes | bet365 match id. |
| `in_play` | `Boolean` | Yes | True while the match is actually under way. |
| `kickoff_estimated` | `Boolean` | No | True when kickoff_utc is not bet365's scheduled start but an estimate derived from the live feed (the instant the match was first seen live), used only when the real start is unknown. |
| `kickoff_utc` | `String` | No | The match's scheduled kickoff (UTC). |
| `label` | `String` | No |  |
| `last` | `Hash` | Yes | One recorded price. |
| `last_seen` | `String` | No |  |
| `league` | `String` | No |  |
| `line` | `String` | No | The market line where applicable (e.g. |
| `links` | `Hash` | No | Ready-made bet365 deep links. |
| `market_count` | `Integer` | Yes | Markets priced for this match (unaffected by the groups filter). |
| `market_id` | `String` | No |  |
| `markets` | `Array` | Yes |  |
| `n2` | `String` | No | Second participant where the market names one; same field as /odds. |
| `note` | `String` | No | A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,… |
| `odds_dec` | `Float` | Yes |  |
| `odds_frac` | `String` | No | Derived display fraction; odds_dec is authoritative. |
| `overtime` | `Boolean` | No | Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it. |
| `periods` | `Array` | No | Per-period / per-set scores where the sport exposes them. |
| `polled_at` | `String` | No | When this match was last refreshed. |
| `pre_close` | `Hash` | Yes | One recorded price. |
| `quotes` | `Object` | No |  |
| `region` | `String` | No |  |
| `score` | `String` | No | Live scoreline while in play, home-away. |
| `sel_id` | `String` | Yes |  |
| `server_time` | `String` | Yes |  |
| `side` | `String` | No | Selection side where the market uses one (e.g. |
| `sport` | `String` | No |  |
| `status` | `String` | No | finished: the match reached full time (a player or side won the required sets, baseball reached the 9th inning, or a cricket run result was derived). |
| `suspended` | `Boolean` | Yes |  |
| `ts` | `String` | Yes |  |
| `updated_at` | `String` | No |  |

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

#### `list(reqmatch = nil, ctrl = nil) -> Array`

List entities matching the given criteria (call with no argument to list all). Returns an array of entities, one per record; `data_get` reads each record. Raises on error.

```ruby
results = client.Odd.list({ "fi" => "example" })
results.each { |item| puts item.data_get }
```

#### `load(reqmatch, ctrl = nil) -> result`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get` reads, and raises on error.

```ruby
result = client.Odd.load({ "fi" => "fi" })
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `OddEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## StatusEntity

```ruby
status = client.Status
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `cache_fixtures` | `Integer` | No |  |
| `cache_quotes` | `Integer` | No |  |
| `catalog_fixtures` | `Integer` | No |  |
| `last_change_unix` | `Integer` | No |  |
| `last_fixture_seen_by_sport` | `Hash` | No | Per sport, the most recent time a fixture for that sport was seen in a catalog sweep. |
| `status` | `String` | No |  |
| `warming` | `Boolean` | No | True right after a restart while the board loads. |

### Operations

#### `load(reqmatch, ctrl = nil) -> result`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get` reads, and raises on error.

```ruby
result = client.Status.load()
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `StatusEntity` instance with the same client and
options.

#### `get_name -> String`

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

```ruby
client = MovioddsOddsSDK.new({
  "feature" => {
    "ratelimit" => { "active" => true },
    "retry" => { "active" => true },
    "test" => { "active" => true },
    "timeout" => { "active" => true },
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

