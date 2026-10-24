# MovioddsOdds Python SDK Reference

Complete API reference for the MovioddsOdds Python SDK.


## MovioddsOddsSDK

### Constructor

```python
from movioddsodds_sdk import MovioddsOddsSDK

client = MovioddsOddsSDK(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `dict` | SDK configuration options. |
| `options["apikey"]` | `str` | API key for authentication. |
| `options["base"]` | `str` | Base URL for API requests. |
| `options["prefix"]` | `str` | URL prefix appended after base. |
| `options["suffix"]` | `str` | URL suffix appended after path. |
| `options["headers"]` | `dict` | Custom headers for all requests. |
| `options["feature"]` | `dict` | Feature configuration. |
| `options["system"]` | `dict` | System overrides (e.g. custom fetch). |


### Static Methods

#### `MovioddsOddsSDK.test(testopts=None, sdkopts=None)`

Create a test client with mock features active. Both arguments may be `None`.

```python
client = MovioddsOddsSDK.test()
```


### Instance Methods

#### `BetBuilder(data=None)`

Create a new `BetBuilderEntity` instance. Pass `None` for no initial data.

#### `Odd(data=None)`

Create a new `OddEntity` instance. Pass `None` for no initial data.

#### `Status(data=None)`

Create a new `StatusEntity` instance. Pass `None` for no initial data.

#### `options_map() -> dict`

Return a deep copy of the current SDK options.

#### `get_utility() -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs=None) -> dict`

Make a direct HTTP request to any API endpoint. Returns a result `dict` with `ok`, `status`, `headers`, and `data` (or `err` on failure). This escape hatch never raises — branch on `result["ok"]`.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs["path"]` | `str` | URL path with optional `{param}` placeholders. |
| `fetchargs["method"]` | `str` | HTTP method (default: `"GET"`). |
| `fetchargs["params"]` | `dict` | Path parameter values. |
| `fetchargs["query"]` | `dict` | Query string parameters. |
| `fetchargs["headers"]` | `dict` | Request headers (merged with defaults). |
| `fetchargs["body"]` | `any` | Request body (dicts are JSON-serialized). |

**Returns:** `result_dict`

#### `prepare(fetchargs=None) -> dict`

Prepare a fetch definition without sending. Returns the `fetchdef` and raises on error.


---

## BetBuilderEntity

```python
bet_builder = client.BetBuilder()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `results` | `list` | Yes |  |
| `server_time` | `str` | Yes |  |
| `slips` | `list` | Yes |  |

### Operations

#### `create(reqdata, ctrl=None) -> BetBuilderEntity`

Create a new entity with the given data. Returns the created entity and raises on error.

```python
result = client.BetBuilder().create({
    "slips": [],  # list
})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `BetBuilderEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## OddEntity

```python
odd = client.Odd()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `away` | `str` | No |  |
| `class_id` | `str` | Yes | bet365 class id (F1 10, golf 7, cycling 38, American football 12, baseball 16, ice hockey 17, basketball 18, rugby union 8, rugby league 19, Australian rules 36). |
| `count` | `int` | Yes | Number of quotes. |
| `event_id` | `str` | Yes | bet365 event id (the drilled body's EV FI). |
| `event_name` | `str` | No | Event name, e.g. |
| `final_score` | `str` | No | The last scoreline seen (aggregate home-away; a comma-separated set list for set sports; for cricket bet365's Australian wickets/runs per innings in batting order, for example 7/199,8/141). |
| `finished_at` | `str` | No | The last instant the match was seen live (≈ when it finished). |
| `fixture` | `str` | Yes |  |
| `fixture_id` | `str` | No | The id that recorded this point. |
| `group_id` | `str` | No |  |
| `group_name` | `str` | No | Market display name (same as /odds). |
| `groups` | `int` | Yes | Number of markets. |
| `handicap` | `str` | No | The handicap where applicable; same field as /odds. |
| `home` | `str` | No |  |
| `id` | `str` | Yes | bet365 match id. |
| `in_play` | `bool` | Yes | True while the match is actually under way. |
| `kickoff_estimated` | `bool` | No | True when kickoff_utc is not bet365's scheduled start but an estimate derived from the live feed (the instant the match was first seen live), used only when the real start is unknown. |
| `kickoff_utc` | `str` | No | The match's scheduled kickoff (UTC). |
| `label` | `str` | No |  |
| `last` | `dict` | Yes | One recorded price. |
| `last_seen` | `str` | No |  |
| `league` | `str` | No |  |
| `line` | `str` | No | The market line where applicable (e.g. |
| `links` | `dict` | No | Ready-made bet365 deep links. |
| `market_count` | `int` | Yes | Markets priced for this match (unaffected by the groups filter). |
| `market_id` | `str` | No |  |
| `markets` | `list` | Yes |  |
| `n2` | `str` | No | Second participant where the market names one; same field as /odds. |
| `note` | `str` | No | A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,… |
| `odds_dec` | `float` | Yes |  |
| `odds_frac` | `str` | No | Derived display fraction; odds_dec is authoritative. |
| `overtime` | `bool` | No | Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it. |
| `periods` | `list` | No | Per-period / per-set scores where the sport exposes them. |
| `polled_at` | `str` | No | When this match was last refreshed. |
| `pre_close` | `dict` | Yes | One recorded price. |
| `quotes` | `list | None` | No |  |
| `region` | `str` | No |  |
| `score` | `str` | No | Live scoreline while in play, home-away. |
| `sel_id` | `str` | Yes |  |
| `server_time` | `str` | Yes |  |
| `side` | `str` | No | Selection side where the market uses one (e.g. |
| `sport` | `str` | No |  |
| `status` | `str` | No | finished: the match reached full time (a player or side won the required sets, baseball reached the 9th inning, or a cricket run result was derived). |
| `suspended` | `bool` | Yes |  |
| `ts` | `str` | Yes |  |
| `updated_at` | `str` | No |  |

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

#### `list(reqmatch=None, ctrl=None) -> list[OddEntity]`

List entities matching the given criteria. The match is optional — call `list()` with no argument to list all records. Returns a list of entities, one per record, and raises on error.

```python
results = client.Odd().list({"fi": "example"})
for odd in results:
    print(odd.data_get())
```

#### `load(reqmatch, ctrl=None) -> OddEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.Odd().load({"fi": "fi"})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `OddEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## StatusEntity

```python
status = client.Status()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `cache_fixtures` | `int` | No |  |
| `cache_quotes` | `int` | No |  |
| `catalog_fixtures` | `int` | No |  |
| `last_change_unix` | `int` | No |  |
| `last_fixture_seen_by_sport` | `dict` | No | Per sport, the most recent time a fixture for that sport was seen in a catalog sweep. |
| `status` | `str` | No |  |
| `warming` | `bool` | No | True right after a restart while the board loads. |

### Operations

#### `load(reqmatch, ctrl=None) -> StatusEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.Status().load()
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `StatusEntity` instance with the same options.

#### `get_name() -> str`

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

```python
client = MovioddsOddsSDK({
    "feature": {
        "ratelimit": {"active": True},
        "retry": {"active": True},
        "test": {"active": True},
        "timeout": {"active": True},
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

