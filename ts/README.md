# MovioddsOdds TypeScript SDK



The TypeScript SDK for the MovioddsOdds API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.BetBuilder()` — each with a small set of operations (`list`, `load`, `create`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.

> Also generated from this model: `go`, `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb` — see
> the [top-level README](../README.md).


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/moviodds-odds-sdk/tags)), or from a
clone, which carries the compiled `dist/`:

```bash
git clone https://github.com/voxgig-sdk/moviodds-odds-sdk
npm install ./moviodds-odds-sdk/ts
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record. The client sends the API key in the `X-API-Key` header.

### 1. Create a client

```ts
import { MovioddsOddsSDK } from '@voxgig-sdk/moviodds-odds-sdk'

const client = new MovioddsOddsSDK({
  apikey: process.env.MOVIODDS_ODDS_APIKEY,
})
```

### 4. Create, update, and remove

```ts
// Create — returns the created BetBuilder ENTITY (.data() for the record)
const created = await client.BetBuilder().create({
  slips: [],
})

```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const odds = await client.Odd().list({ fi: "example" })
  console.log(odds.map((item) => item.data()))
} catch (err) {
  console.error('list failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
result envelope. Branch on `ok`; on failure `status` holds the HTTP status
(for error responses) and `err` holds the error:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (!result.ok) {
  console.error('request failed:', result.status, result.err)
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = MovioddsOddsSDK.test()

const odds = await client.Odd().list({ fi: 'example_fi' })
// odds is an array of Odd entities, one per mock record
console.log(odds.map((odd) => odd.data()))
```

You can also use the instance method:

```ts
const client = new MovioddsOddsSDK({ apikey: '...' })
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.Odd()

// First call runs the operation and stores its result
await entity.list({ fi: 'example_fi' })

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data.id)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new MovioddsOddsSDK({
  apikey: '...',
  extend: [logger],
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
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


## Reference

### MovioddsOddsSDK

#### Constructor

```ts
new MovioddsOddsSDK(options?: {
  apikey?: string
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `BetBuilder(data?)` | `BetBuilderEntity` | Create a BetBuilder entity instance. |
| `Odd(data?)` | `OddEntity` | Create an Odd entity instance. |
| `Status(data?)` | `StatusEntity` | Create a Status entity instance. |
| `tester(testopts?, sdkopts?)` | `MovioddsOddsSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `MovioddsOddsSDK.test(testopts?, sdkopts?)` | `MovioddsOddsSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria, and return it. |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria, one per record. |
| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity, and return it. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): MovioddsOddsSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity itself — there is no result
envelope, and an entity's `data()` reads its record:

- `load` and `create` resolve to a single entity object.
- `list` resolves to an **array** of entity objects (iterate it directly;
  there is no `.data` and no `.ok`).

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

#### BetBuilder

| Field | Description |
| --- | --- |
| `results` |  |
| `server_time` |  |
| `slips` |  |

Operations: create.

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

Operations: list, load.

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

Operations: load.

API path: `/health`



## Entities


### BetBuilder

Create an instance: `const bet_builder = client.BetBuilder()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `results` | `any[]` |  |
| `server_time` | `string` |  |
| `slips` | `any[]` |  |

#### Example: Create

```ts
const bet_builder = await client.BetBuilder().create({
  slips: [],
})
```


### Odd

Create an instance: `const odd = client.Odd()`

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
| `last` | `Record<string, any>` | One recorded price. |
| `last_seen` | `string` |  |
| `league` | `string` |  |
| `line` | `string` | The market line where applicable (e.g. |
| `links` | `Record<string, any>` | Ready-made bet365 deep links. |
| `market_count` | `number` | Markets priced for this match (unaffected by the groups filter). |
| `market_id` | `string` |  |
| `markets` | `any[]` |  |
| `n2` | `string` | Second participant where the market names one; same field as /odds. |
| `note` | `string` | A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,… |
| `odds_dec` | `number` |  |
| `odds_frac` | `string` | Derived display fraction; odds_dec is authoritative. |
| `overtime` | `boolean` | Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it. |
| `periods` | `any[]` | Per-period / per-set scores where the sport exposes them. |
| `polled_at` | `string` | When this match was last refreshed. |
| `pre_close` | `Record<string, any>` | One recorded price. |
| `quotes` | `any[] | null` |  |
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

```ts
const odd = await client.Odd().load({ fi: 'fi' })
```

#### Example: List

```ts
const odds = await client.Odd().list({ fi: "example" })
```


### Status

Create an instance: `const status = client.Status()`

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
| `last_fixture_seen_by_sport` | `Record<string, any>` | Per sport, the most recent time a fixture for that sport was seen in a catalog sweep. |
| `status` | `string` |  |
| `warming` | `boolean` | True right after a restart while the board loads. |

#### Example: Load

```ts
const status = await client.Status().load()
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

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
moviodds-odds/
├── src/
│   ├── MovioddsOddsSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { MovioddsOddsSDK } from '@voxgig-sdk/moviodds-odds-sdk'
```

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const odd = client.Odd()
await odd.list({ fi: "example" })

// odd.data() now returns the odd data from the last `list`
// odd.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
