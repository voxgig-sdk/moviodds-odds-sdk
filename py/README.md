# MovioddsOdds Python SDK



The Python SDK for the MovioddsOdds API — an entity-oriented client following Pythonic conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `client.BetBuilder()` — each
carrying a small, uniform set of operations (`list`, `load`, `create`) instead of raw URL
paths and query strings. You work with named resources and verbs, which
keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to PyPI. Install it from the GitHub
release tag (`py/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/moviodds-odds-sdk/tags)) or
from a source checkout:

```bash
pip install -e .
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record. The client sends the API key in the `X-API-Key` header.

### 1. Create a client

```python
import os
from movioddsodds_sdk import MovioddsOddsSDK

client = MovioddsOddsSDK({
    "apikey": os.environ.get("MOVIODDS_ODDS_APIKEY"),
})
```

### 4. Create, update, and remove

```python
# Create — returns the ENTITY (call data_get() for the record)
created = client.BetBuilder().create({"slips": []})

```


## Error handling

Entity operations raise on failure, so wrap them in `try` / `except`:

```python
try:
    odds = client.Odd().list({"fi": "example"})
    print([item.data_get() for item in odds])
except Exception as err:
    print(f"list failed: {err}")
```

`direct()` does **not** raise — it returns the result envelope. Branch
on `ok`; on failure `status` holds the HTTP status (for error responses)
and `err` holds a transport error, so read both defensively:

```python
result = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example_id"},
})

if not result["ok"]:
    print("request failed:", result.get("status"), result.get("err"))
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```python
result = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example"},
})

if result["ok"]:
    print(result["status"])  # 200
    print(result["data"])    # response body
else:
    # A non-2xx response carries status + data (the error body); a
    # transport-level failure carries err instead. Only one is present, so
    # read both with .get() rather than indexing a key that may be absent.
    print(result.get("status"), result.get("err"))
```

### Prepare a request without sending it

```python
# prepare() returns the fetch definition and raises on error.
fetchdef = client.prepare({
    "path": "/api/resource/{id}",
    "method": "DELETE",
    "params": {"id": "example"},
})

print(fetchdef["url"])
print(fetchdef["method"])
print(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```python
client = MovioddsOddsSDK.test()

# Entity ops return the entity, and list one per record; they raise on error.
odd = client.Odd().list({"fi": "example"})
# data_get() on an entity reads its mock response record
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```python
def mock_fetch(url, init):
    return {
        "status": 200,
        "statusText": "OK",
        "headers": {},
        "json": lambda: {"id": "mock01"},
    }, None

client = MovioddsOddsSDK({
    "base": "http://localhost:8080",
    "system": {
        "fetch": mock_fetch,
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
cd py && pytest test/
```


## Reference

### MovioddsOddsSDK

```python
from movioddsodds_sdk import MovioddsOddsSDK

client = MovioddsOddsSDK(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `str` | API key for authentication. |
| `base` | `str` | Base URL of the API server. |
| `prefix` | `str` | URL path prefix prepended to all requests. |
| `suffix` | `str` | URL path suffix appended to all requests. |
| `feature` | `dict` | Feature activation flags. |
| `extend` | `list` | Additional Feature instances to load. |
| `system` | `dict` | System overrides (e.g. custom `fetch` function). |

### test

```python
client = MovioddsOddsSDK.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `None`.

### MovioddsOddsSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> dict` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> dict` | Build an HTTP request definition without sending. Raises on error. |
| `direct` | `(fetchargs) -> dict` | Build and send an HTTP request. Returns a result dict (branch on `ok`). |
| `BetBuilder` | `(data) -> BetBuilderEntity` | Create a BetBuilder entity instance. |
| `Odd` | `(data) -> OddEntity` | Create an Odd entity instance. |
| `Status` | `(data) -> StatusEntity` | Create a Status entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any` | Load a single entity by match criteria, and return it. Raises on error. |
| `list` | `(reqmatch, ctrl) -> list` | List entities matching the criteria, one per record. Raises on error. |
| `create` | `(reqdata, ctrl) -> any` | Create a new entity, and return it. Raises on error. |
| `data_get` | `() -> dict` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> dict` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> str` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` a `list` of entities, one
per record; an entity's `data_get()` reads its record (a `dict`). They raise
on error, so wrap calls in `try`/`except` to handle failures.

The `direct()` escape hatch never raises — it returns a result `dict`
you branch on via `result["ok"]`:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `bool` | `True` if the HTTP status is 2xx. |
| `status` | `int` | HTTP status code. |
| `headers` | `dict` | Response headers. |
| `data` | `any` | Parsed JSON response body. |

On error, `ok` is `False` and `err` contains the error value.

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

Create an instance: `bet_builder = client.BetBuilder()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `results` | `list` |  |
| `server_time` | `str` |  |
| `slips` | `list` |  |

#### Example: Create

```python
bet_builder = client.BetBuilder().create({
    "slips": [],  # list
})
```


### Odd

Create an instance: `odd = client.Odd()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `away` | `str` |  |
| `class_id` | `str` | bet365 class id (F1 10, golf 7, cycling 38, American football 12, baseball 16, ice hockey 17, basketball 18, rugby union 8, rugby league 19, Australian rules 36). |
| `count` | `int` | Number of quotes. |
| `event_id` | `str` | bet365 event id (the drilled body's EV FI). |
| `event_name` | `str` | Event name, e.g. |
| `final_score` | `str` | The last scoreline seen (aggregate home-away; a comma-separated set list for set sports; for cricket bet365's Australian wickets/runs per innings in batting order, for example 7/199,8/141). |
| `finished_at` | `str` | The last instant the match was seen live (≈ when it finished). |
| `fixture` | `str` |  |
| `fixture_id` | `str` | The id that recorded this point. |
| `group_id` | `str` |  |
| `group_name` | `str` | Market display name (same as /odds). |
| `groups` | `int` | Number of markets. |
| `handicap` | `str` | The handicap where applicable; same field as /odds. |
| `home` | `str` |  |
| `id` | `str` | bet365 match id. |
| `in_play` | `bool` | True while the match is actually under way. |
| `kickoff_estimated` | `bool` | True when kickoff_utc is not bet365's scheduled start but an estimate derived from the live feed (the instant the match was first seen live), used only when the real start is unknown. |
| `kickoff_utc` | `str` | The match's scheduled kickoff (UTC). |
| `label` | `str` |  |
| `last` | `dict` | One recorded price. |
| `last_seen` | `str` |  |
| `league` | `str` |  |
| `line` | `str` | The market line where applicable (e.g. |
| `links` | `dict` | Ready-made bet365 deep links. |
| `market_count` | `int` | Markets priced for this match (unaffected by the groups filter). |
| `market_id` | `str` |  |
| `markets` | `list` |  |
| `n2` | `str` | Second participant where the market names one; same field as /odds. |
| `note` | `str` | A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,… |
| `odds_dec` | `float` |  |
| `odds_frac` | `str` | Derived display fraction; odds_dec is authoritative. |
| `overtime` | `bool` | Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it. |
| `periods` | `list` | Per-period / per-set scores where the sport exposes them. |
| `polled_at` | `str` | When this match was last refreshed. |
| `pre_close` | `dict` | One recorded price. |
| `quotes` | `list | None` |  |
| `region` | `str` |  |
| `score` | `str` | Live scoreline while in play, home-away. |
| `sel_id` | `str` |  |
| `server_time` | `str` |  |
| `side` | `str` | Selection side where the market uses one (e.g. |
| `sport` | `str` |  |
| `status` | `str` | finished: the match reached full time (a player or side won the required sets, baseball reached the 9th inning, or a cricket run result was derived). |
| `suspended` | `bool` |  |
| `ts` | `str` |  |
| `updated_at` | `str` |  |

#### Example: Load

```python
odd = client.Odd().load({"fi": "fi"})
```

#### Example: List

```python
odds = client.Odd().list({"fi": "example"})
```


### Status

Create an instance: `status = client.Status()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `cache_fixtures` | `int` |  |
| `cache_quotes` | `int` |  |
| `catalog_fixtures` | `int` |  |
| `last_change_unix` | `int` |  |
| `last_fixture_seen_by_sport` | `dict` | Per sport, the most recent time a fixture for that sport was seen in a catalog sweep. |
| `status` | `str` |  |
| `warming` | `bool` | True right after a restart while the board loads. |

#### Example: Load

```python
status = client.Status().load()
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

Features are the extension mechanism. A feature is a Python class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as dicts

The Python SDK uses plain dicts throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `helpers.to_map()` to safely validate that a value is a dict.

### Module structure

```
py/
├── movioddsodds_sdk.py         -- Main SDK module
├── config.py                    -- Configuration
├── schema.py                    -- Generated option + entity specs
├── features.py                  -- Feature factory
├── core/                        -- Core types and context
├── entity/                      -- Entity implementations
├── feature/                     -- Built-in features (Base, Test, Log)
├── utility/                     -- Utility functions and struct library
└── test/                        -- Test suites
```

The main module (`movioddsodds_sdk`) exports the SDK class.
Import entity or utility modules directly only when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```python
odd = client.Odd()
odd.list({"fi": "example"})

# odd.data_get() now returns the odd data from the last list
# odd.match_get() returns the last match criteria
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
