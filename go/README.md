# MovioddsOdds Golang SDK



The Golang SDK for the MovioddsOdds API — an entity-oriented client using standard Go conventions. No generics required; data flows as `map[string]any`.

It exposes the API as capitalised, semantic **Entities** — e.g. `client.BetBuilder(nil)` — each with the same small set of operations (`List`, `Load`, `Create`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Also generated from this model: `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb`, `ts` — see
> the [top-level README](../README.md).


## Install
```bash
go get github.com/voxgig-sdk/moviodds-odds-sdk/go@latest
```

The Go module proxy resolves the version from the `go/vX.Y.Z` GitHub
release tag — see [Tags](https://github.com/voxgig-sdk/moviodds-odds-sdk/tags) for the available versions.

To vendor from a local checkout instead, clone this repo alongside your
project and add a `replace` directive pointing at the checked-out
`go/` directory:

```bash
go mod edit -replace github.com/voxgig-sdk/moviodds-odds-sdk/go=../moviodds-odds-sdk/go
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record. The client sends the API key in the `X-API-Key` header.

### Quickstart

A complete program: create a client, then call the entity operations.
Each operation returns `(value, error)` — the value is the entity, and for
`List` a `[]any` of entities, one per record (there is no `{ok, data}`
wrapper), so check `err` and read a record through the entity's
`Data()`.

```go
package main

import (
    "fmt"
    "os"
    sdk "github.com/voxgig-sdk/moviodds-odds-sdk/go"
)

func main() {
    client := sdk.NewMovioddsOddsSDK(map[string]any{
        "apikey": os.Getenv("MOVIODDS_ODDS_APIKEY"),
    })

    // Create a betBuilder.
    created, err := client.BetBuilder(nil).Create(map[string]any{"slips": []any{}}, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(created.(sdk.Entity).Data())
}
```


## Error handling

Every entity operation returns `(value, error)`. Check `err` before
using the value — there is no exception to catch:

```go
odds, err := client.Odd(nil).List(map[string]any{"fi": "example"}, nil)
if err != nil {
    // handle err
    return
}
_ = odds
```

`Direct` follows the same `(value, error)` convention:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example_id"},
})
if err != nil {
    // handle err
}
_ = result
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

if result["ok"] == true {
    fmt.Println(result["status"]) // 200
    fmt.Println(result["data"])   // response body
}
```

### Prepare a request without sending it

```go
fetchdef, err := client.Prepare(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "DELETE",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

fmt.Println(fetchdef["url"])
fmt.Println(fetchdef["method"])
fmt.Println(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```go
client := sdk.Test()

odds, err := client.Odd(nil).List(
    map[string]any{"fi": "example"}, nil,
)
if err != nil {
    panic(err)
}
// A []any of entities, one per mock record.
for _, item := range odds.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```go
mockFetch := func(url string, init map[string]any) (map[string]any, error) {
    return map[string]any{
        "status":     200,
        "statusText": "OK",
        "headers":    map[string]any{},
        "json": (func() any)(func() any {
            return map[string]any{"id": "mock01"}
        }),
    }, nil
}

client := sdk.NewMovioddsOddsSDK(map[string]any{
    "base": "http://localhost:8080",
    "system": map[string]any{
        "fetch": (func(string, map[string]any) (map[string]any, error))(mockFetch),
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
cd go && go test ./test/...
```


## Reference

### NewMovioddsOddsSDK

```go
func NewMovioddsOddsSDK(options map[string]any) *MovioddsOddsSDK
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `"apikey"` | `string` | API key for authentication. |
| `"base"` | `string` | Base URL of the API server. |
| `"prefix"` | `string` | URL path prefix prepended to all requests. |
| `"suffix"` | `string` | URL path suffix appended to all requests. |
| `"feature"` | `map[string]any` | Feature activation flags. |
| `"extend"` | `[]any` | Additional Feature instances to load. |
| `"system"` | `map[string]any` | System overrides (e.g. custom `"fetch"` function). |

### TestSDK

```go
func TestSDK(testopts map[string]any, sdkopts map[string]any) *MovioddsOddsSDK
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### MovioddsOddsSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `OptionsMap` | `() map[string]any` | Deep copy of current SDK options. |
| `GetUtility` | `() *Utility` | Copy of the SDK utility object. |
| `Prepare` | `(fetchargs map[string]any) (map[string]any, error)` | Build an HTTP request definition without sending. |
| `Direct` | `(fetchargs map[string]any) (map[string]any, error)` | Build and send an HTTP request. |
| `BetBuilder` | `(data map[string]any) MovioddsOddsEntity` | Create a BetBuilder entity instance. |
| `Odd` | `(data map[string]any) MovioddsOddsEntity` | Create an Odd entity instance. |
| `Status` | `(data map[string]any) MovioddsOddsEntity` | Create a Status entity instance. |

### Entity interface (MovioddsOddsEntity)

All entities implement the `MovioddsOddsEntity` interface.

| Method | Signature | Description |
| --- | --- | --- |
| `Load` | `(reqmatch, ctrl map[string]any) (any, error)` | Load a single entity by match criteria, and return it. |
| `List` | `(reqmatch, ctrl map[string]any) (any, error)` | List entities matching the criteria, one per record. |
| `Create` | `(reqdata, ctrl map[string]any) (any, error)` | Create a new entity, and return it. |
| `Data` | `(args ...any) any` | Get or set entity data. |
| `Match` | `(args ...any) any` | Get or set entity match criteria. |
| `Make` | `() Entity` | Create a new instance with the same options. |
| `GetName` | `() string` | Return the entity name. |

### Result shape

Entity operations return `(value, error)`. The `value` is the entity
itself — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `Load` / `Create` | the entity, whose `Data()` reads its record (`map[string]any`) |
| `List` | a `[]any` of entities, one per record |

Check `err` first, then use the value directly (or the typed
`...Typed` variants, which return the entity's model struct and a typed
slice):

    betBuilder, err := client.BetBuilder(nil).Create(map[string]any{/* fields */}, nil)
    if err != nil { /* handle */ }
    // betBuilder is the entity; betBuilder.(sdk.Entity).Data() reads its record

Only `Direct()` returns a response envelope — a `map[string]any` with
`"ok"`, `"status"`, `"headers"`, and `"data"` keys.

### Entities

#### BetBuilder

| Field | Description |
| --- | --- |
| `"results"` |  |
| `"server_time"` |  |
| `"slips"` |  |

Operations: Create.

API path: `/betbuilder/price`

#### Odd

| Field | Description |
| --- | --- |
| `"away"` |  |
| `"class_id"` | bet365 class id (F1 10, golf 7, cycling 38, American football 12, baseball 16, ice hockey 17, basketball 18, rugby union 8, rugby league 19, Australian rules 36). |
| `"count"` | Number of quotes. |
| `"event_id"` | bet365 event id (the drilled body's EV FI). |
| `"event_name"` | Event name, e.g. |
| `"final_score"` | The last scoreline seen (aggregate home-away; a comma-separated set list for set sports; for cricket bet365's Australian wickets/runs per innings in batting order, for example 7/199,8/141). |
| `"finished_at"` | The last instant the match was seen live (≈ when it finished). |
| `"fixture"` |  |
| `"fixture_id"` | The id that recorded this point. |
| `"group_id"` |  |
| `"group_name"` | Market display name (same as /odds). |
| `"groups"` | Number of markets. |
| `"handicap"` | The handicap where applicable; same field as /odds. |
| `"home"` |  |
| `"id"` | bet365 match id. |
| `"in_play"` | True while the match is actually under way. |
| `"kickoff_estimated"` | True when kickoff_utc is not bet365's scheduled start but an estimate derived from the live feed (the instant the match was first seen live), used only when the real start is unknown. |
| `"kickoff_utc"` | The match's scheduled kickoff (UTC). |
| `"label"` |  |
| `"last"` | One recorded price. |
| `"last_seen"` |  |
| `"league"` |  |
| `"line"` | The market line where applicable (e.g. |
| `"links"` | Ready-made bet365 deep links. |
| `"market_count"` | Markets priced for this match (unaffected by the groups filter). |
| `"market_id"` |  |
| `"markets"` |  |
| `"n2"` | Second participant where the market names one; same field as /odds. |
| `"note"` | A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,… |
| `"odds_dec"` |  |
| `"odds_frac"` | Derived display fraction; odds_dec is authoritative. |
| `"overtime"` | Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it. |
| `"periods"` | Per-period / per-set scores where the sport exposes them. |
| `"polled_at"` | When this match was last refreshed. |
| `"pre_close"` | One recorded price. |
| `"quotes"` |  |
| `"region"` |  |
| `"score"` | Live scoreline while in play, home-away. |
| `"sel_id"` |  |
| `"server_time"` |  |
| `"side"` | Selection side where the market uses one (e.g. |
| `"sport"` |  |
| `"status"` | finished: the match reached full time (a player or side won the required sets, baseball reached the 9th inning, or a cricket run result was derived). |
| `"suspended"` |  |
| `"ts"` |  |
| `"updated_at"` |  |

Operations: List, Load.

API path: `/closing`

#### Status

| Field | Description |
| --- | --- |
| `"cache_fixtures"` |  |
| `"cache_quotes"` |  |
| `"catalog_fixtures"` |  |
| `"last_change_unix"` |  |
| `"last_fixture_seen_by_sport"` | Per sport, the most recent time a fixture for that sport was seen in a catalog sweep. |
| `"status"` |  |
| `"warming"` | True right after a restart while the board loads. |

Operations: Load.

API path: `/health`



## Entities


### BetBuilder

Create an instance: `betBuilder := client.BetBuilder(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Create(data, ctrl)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `results` | `[]any` |  |
| `server_time` | `string` |  |
| `slips` | `[]any` |  |

#### Example: Create

```go
result, err := client.BetBuilder(nil).Create(map[string]any{
    "slips": []any{},
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result.(sdk.Entity).Data()) // the created entity's record
```


### Odd

Create an instance: `odd := client.Odd(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `away` | `string` |  |
| `class_id` | `string` | bet365 class id (F1 10, golf 7, cycling 38, American football 12, baseball 16, ice hockey 17, basketball 18, rugby union 8, rugby league 19, Australian rules 36). |
| `count` | `int` | Number of quotes. |
| `event_id` | `string` | bet365 event id (the drilled body's EV FI). |
| `event_name` | `string` | Event name, e.g. |
| `final_score` | `string` | The last scoreline seen (aggregate home-away; a comma-separated set list for set sports; for cricket bet365's Australian wickets/runs per innings in batting order, for example 7/199,8/141). |
| `finished_at` | `string` | The last instant the match was seen live (≈ when it finished). |
| `fixture` | `string` |  |
| `fixture_id` | `string` | The id that recorded this point. |
| `group_id` | `string` |  |
| `group_name` | `string` | Market display name (same as /odds). |
| `groups` | `int` | Number of markets. |
| `handicap` | `string` | The handicap where applicable; same field as /odds. |
| `home` | `string` |  |
| `id` | `string` | bet365 match id. |
| `in_play` | `bool` | True while the match is actually under way. |
| `kickoff_estimated` | `bool` | True when kickoff_utc is not bet365's scheduled start but an estimate derived from the live feed (the instant the match was first seen live), used only when the real start is unknown. |
| `kickoff_utc` | `string` | The match's scheduled kickoff (UTC). |
| `label` | `string` |  |
| `last` | `map[string]any` | One recorded price. |
| `last_seen` | `string` |  |
| `league` | `string` |  |
| `line` | `string` | The market line where applicable (e.g. |
| `links` | `map[string]any` | Ready-made bet365 deep links. |
| `market_count` | `int` | Markets priced for this match (unaffected by the groups filter). |
| `market_id` | `string` |  |
| `markets` | `[]any` |  |
| `n2` | `string` | Second participant where the market names one; same field as /odds. |
| `note` | `string` | A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,… |
| `odds_dec` | `float64` |  |
| `odds_frac` | `string` | Derived display fraction; odds_dec is authoritative. |
| `overtime` | `bool` | Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it. |
| `periods` | `[]any` | Per-period / per-set scores where the sport exposes them. |
| `polled_at` | `string` | When this match was last refreshed. |
| `pre_close` | `map[string]any` | One recorded price. |
| `quotes` | `any` |  |
| `region` | `string` |  |
| `score` | `string` | Live scoreline while in play, home-away. |
| `sel_id` | `string` |  |
| `server_time` | `string` |  |
| `side` | `string` | Selection side where the market uses one (e.g. |
| `sport` | `string` |  |
| `status` | `string` | finished: the match reached full time (a player or side won the required sets, baseball reached the 9th inning, or a cricket run result was derived). |
| `suspended` | `bool` |  |
| `ts` | `string` |  |
| `updated_at` | `string` |  |

#### Example: Load

```go
odd, err := client.Odd(nil).Load(map[string]any{"fi": "fi"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(odd.(sdk.Entity).Data()) // the loaded entity's record
```

#### Example: List

```go
odds, err := client.Odd(nil).List(map[string]any{"fi": "example"}, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range odds.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```


### Status

Create an instance: `status := client.Status(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `cache_fixtures` | `int` |  |
| `cache_quotes` | `int` |  |
| `catalog_fixtures` | `int` |  |
| `last_change_unix` | `int` |  |
| `last_fixture_seen_by_sport` | `map[string]any` | Per sport, the most recent time a fixture for that sport was seen in a catalog sweep. |
| `status` | `string` |  |
| `warming` | `bool` | True right after a restart while the board loads. |

#### Example: Load

```go
status, err := client.Status(nil).Load(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(status.(sdk.Entity).Data()) // the loaded entity's record
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

Features are the extension mechanism. A feature implements the
`Feature` interface and provides hooks — functions keyed by pipeline
stage names.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as maps

The Go SDK uses `map[string]any` throughout rather than typed structs.
This mirrors the dynamic nature of the API and keeps the SDK
flexible — no code generation is needed when the API schema changes.

An operation returns the entity, and its `Data()` returns the record. Use
`core.ToMapAny()` to safely cast that record, or data nested in it, to
`map[string]any`: it returns `nil` for anything else, an entity included.

### Package structure

```
github.com/voxgig-sdk/moviodds-odds-sdk/go/
├── moviodds-odds.go        # Root package — type aliases and constructors
├── core/               # SDK core — client, types, pipeline
├── entity/             # Entity implementations
├── feature/            # Built-in features (Base, Test, Log)
├── utility/            # Utility functions and struct library
└── test/               # Test suites
```

The root package (`github.com/voxgig-sdk/moviodds-odds-sdk/go`) re-exports everything needed
for normal use. Import sub-packages only when you need specific types
like `core.ToMapAny`.

### Entity state

Entity instances are stateful. After a successful `List`, the entity
stores the returned data and match criteria internally.

```go
odd := client.Odd(nil)
odd.List(map[string]any{"fi": "example"}, nil)

// odd.Data() now returns the odd data from the last list
// odd.Match() returns the last match criteria
```

Call `Make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`Direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `Prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
