# MovioddsOdds PHP SDK



The PHP SDK for the MovioddsOdds API — an entity-oriented client using PHP conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `$client->BetBuilder()` — with named operations (`list`/`load`/`create`) instead of raw URL paths and query strings. Working with resources and verbs keeps call sites self-describing and reduces cognitive load.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to Packagist. Install it from the
GitHub release tag (`php/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/moviodds-odds-sdk/tags)), or
from a clone as a Composer path repository:

```bash
git clone https://github.com/voxgig-sdk/moviodds-odds-sdk
composer config repositories.moviodds-odds-sdk path ./moviodds-odds-sdk/php
composer require voxgig-sdk/moviodds-odds-sdk:@dev
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record. The client sends the API key in the `X-API-Key` header.

### 1. Create a client

```php
<?php
require_once 'movioddsodds_sdk.php';

$client = new MovioddsOddsSDK([
    "apikey" => getenv("MOVIODDS_ODDS_APIKEY"),
]);
```

### 4. Create, update, and remove

```php
// create() returns the ENTITY — call data_get() for the created BetBuilder record.
$created = $client->BetBuilder()->create(["slips" => []]);

```


## Error handling

Entity operations throw a `\Throwable` on failure, so wrap them in
`try` / `catch`:

```php
try {
    $odds = $client->Odd()->list(["fi" => "example"]);
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```

`direct()` does **not** throw — it returns the result array. Branch on
`ok`; on failure `status` holds the HTTP status (for error responses) and
`err` holds a transport error, so read both defensively:

```php
$result = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example_id"],
]);

if (! $result["ok"]) {
    $err = $result["err"] ?? null;
    echo "request failed: " . ($err ? $err->getMessage() : "HTTP " . $result["status"]);
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```php
// direct() is the raw-HTTP escape hatch: it returns a result array
// (it does not throw). Branch on $result["ok"].
$result = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example"],
]);

if ($result["ok"]) {
    echo $result["status"];  // 200
    print_r($result["data"]);  // response body
} else {
    // On an HTTP error status there is no err (only a transport failure sets
    // it), so fall back to the status code.
    $err = $result["err"] ?? null;
    echo "Error: " . ($err ? $err->getMessage() : "HTTP " . $result["status"]);
}
```

### Prepare a request without sending it

```php
// prepare() throws on error and returns the fetch definition.
$fetchdef = $client->prepare([
    "path" => "/api/resource/{id}",
    "method" => "DELETE",
    "params" => ["id" => "example"],
]);

echo $fetchdef["url"];
echo $fetchdef["method"];
print_r($fetchdef["headers"]);
```

### Use test mode

Create a mock client for unit testing — no server required:

```php
$client = MovioddsOddsSDK::test();

// list() returns entity instances (throws on error);
// call data_get() for the mock record.
$odd = $client->Odd()->list(["fi" => "example"]);
print_r(array_map(fn($item) => $item->data_get(), $odd));
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```php
$mock_fetch = function ($url, $init) {
    return [
        [
            "status" => 200,
            "statusText" => "OK",
            "headers" => [],
            "json" => function () { return ["id" => "mock01"]; },
        ],
        null,
    ];
};

$client = new MovioddsOddsSDK([
    "base" => "http://localhost:8080",
    "system" => [
        "fetch" => $mock_fetch,
    ],
]);
```

### Run live tests

Create a `.env.local` file at the project root:

```
MOVIODDS_ODDS_TEST_LIVE=TRUE
MOVIODDS_ODDS_APIKEY=<your-key>
```

Then run:

```bash
cd php && ./vendor/bin/phpunit test/
```


## Reference

### MovioddsOddsSDK

```php
require_once 'movioddsodds_sdk.php';
$client = new MovioddsOddsSDK($options);
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `array` | Feature activation flags. |
| `extend` | `array` | Additional Feature instances to load. |
| `system` | `array` | System overrides (e.g. custom `fetch` callable). |

### test

```php
$client = MovioddsOddsSDK::test($testopts, $sdkopts);
```

Creates a test-mode client with mock transport. Both arguments may be `null`.

### MovioddsOddsSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `(): array` | Deep copy of current SDK options. |
| `get_utility` | `(): Utility` | Copy of the SDK utility object. |
| `prepare` | `(array $fetchargs): array` | Build an HTTP request definition without sending. |
| `direct` | `(array $fetchargs): array` | Build and send an HTTP request. |
| `BetBuilder` | `($data): BetBuilderEntity` | Create a BetBuilder entity instance. |
| `Odd` | `($data): OddEntity` | Create an Odd entity instance. |
| `Status` | `($data): StatusEntity` | Create a Status entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `($reqmatch, $ctrl): mixed` | Load a single entity by match criteria, and return it. |
| `list` | `(?array $reqmatch = null, $ctrl): mixed` | List entities matching the criteria (call with no argument to list all), one per record. |
| `create` | `($reqdata, $ctrl): mixed` | Create a new entity, and return it. |
| `data_get` | `(): array` | Get entity data. |
| `data_set` | `($data): void` | Set entity data. |
| `match_get` | `(): array` | Get entity match criteria. |
| `match_set` | `($match): void` | Set entity match criteria. |
| `make` | `(): Entity` | Create a new instance with the same options. |
| `get_name` | `(): string` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` an `array` of entities, one
per record; an entity's `data_get()` reads its record (an `array`). They
throw on error, so wrap calls in `try`/`catch` to handle failures.

The `direct()` escape hatch never throws — it returns a result `array`
you branch on via `$result["ok"]`:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `bool` | `true` if the HTTP status is 2xx. |
| `status` | `int` | HTTP status code. |
| `headers` | `array` | Response headers. |
| `data` | `mixed` | Parsed JSON response body. |

On error, `ok` is `false` and `$err` contains the error value.

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

Create an instance: `$bet_builder = $client->BetBuilder();`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `results` | `array` |  |
| `server_time` | `string` |  |
| `slips` | `array` |  |

#### Example: Create

```php
$bet_builder = $client->BetBuilder()->create([
    "slips" => null, // array
]);
```


### Odd

Create an instance: `$odd = $client->Odd();`

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
| `last` | `array` | One recorded price. |
| `last_seen` | `string` |  |
| `league` | `string` |  |
| `line` | `string` | The market line where applicable (e.g. |
| `links` | `array` | Ready-made bet365 deep links. |
| `market_count` | `int` | Markets priced for this match (unaffected by the groups filter). |
| `market_id` | `string` |  |
| `markets` | `array` |  |
| `n2` | `string` | Second participant where the market names one; same field as /odds. |
| `note` | `string` | A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,… |
| `odds_dec` | `float` |  |
| `odds_frac` | `string` | Derived display fraction; odds_dec is authoritative. |
| `overtime` | `bool` | Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it. |
| `periods` | `array` | Per-period / per-set scores where the sport exposes them. |
| `polled_at` | `string` | When this match was last refreshed. |
| `pre_close` | `array` | One recorded price. |
| `quotes` | `mixed` |  |
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

```php
// load() returns the ENTITY — call data_get() for the Odd record (throws on error).
$odd = $client->Odd()->load(["fi" => "fi"]);
```

#### Example: List

```php
// list() returns an array of Odd entities, one per record (throws on error).
$odds = $client->Odd()->list(["fi" => "example"]);
```


### Status

Create an instance: `$status = $client->Status();`

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
| `last_fixture_seen_by_sport` | `array` | Per sport, the most recent time a fixture for that sport was seen in a catalog sweep. |
| `status` | `string` |  |
| `warming` | `bool` | True right after a restart while the board loads. |

#### Example: Load

```php
// load() returns the ENTITY — call data_get() for the Status record (throws on error).
$status = $client->Status()->load();
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

Features are the extension mechanism. A feature is a PHP class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as arrays

The PHP SDK uses plain PHP associative arrays throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `Helpers::to_map()` to safely validate that a value is an array.

### Directory structure

```
php/
├── movioddsodds_sdk.php          -- Main SDK class
├── config.php                     -- Configuration
├── schema.php                     -- Generated option + entity specs
├── features.php                   -- Feature factory
├── core/                          -- Core types and context
├── entity/                        -- Entity implementations
├── feature/                       -- Built-in features (Base, Test, Log)
├── utility/                       -- Utility functions and struct library
└── test/                          -- Test suites
```

The main class (`movioddsodds_sdk.php`) exports the SDK class
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```php
$odd = $client->Odd();
$odd->list(["fi" => "example"]);

// $odd->data_get() now returns the odd data from the last list
// $odd->match_get() returns the last match criteria
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
