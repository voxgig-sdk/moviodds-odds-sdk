# MoviOdds bet365 Odds API

> MoviOdds serves exclusively bet365 odds for soccer, tennis, basketball, American football, ice hockey, baseball, rugby union and league, cricket and Australian rules (more sports being added): every market bet365 prices for a match, pre-match and in-play. Soccer is the default; pass sport=&lt;key&gt; (see the sport parameter), or sport=all, to /odds and /catalog for other sports. Load the board with GET /odds, then keep it current over the WebSocket at wss://moviodds.com/ws (send &#123;&quot;op&quot;:&quot;subscribe&quot;&#125;, optionally with &quot;fixtures&quot; and &quot;groups&quot; lists; you receive a snapshot per match, then delta messages as prices change, and a remove message when a market closes or a match leaves the board). WebSockets are not describable in OpenAPI, so the stream is documented at https://moviodds.com/doc.
>
> The odds feed needs no key. Only POST /betbuilder/price needs an API key (X-API-Key).
>
> MoviOdds is an independent project and is not affiliated with or endorsed by bet365.

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 3 entities and 9 HTTP routes. There are 6 SDK targets and 2 companion tools.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### BetBuilder

Results: One result per slip, in request order.

SDK operations: `create`.

### Odd

Results: The closing line per selection.; The price timeline (oldest first).; The finished matches for the sport, newest first.; The match list.; The board (or the filtered slice).; The outright events for the sport, each with its markets and current prices. A valid sport with no futures (a covered sport still warming, or a real sport the feature does not cover) returns an empty events list. When the whole feature is off: &#123;&quot;enabled&quot;: false&#125;.; Every current quote for the match.

SDK operations: `list`, `load`.

Key fields to recognise:

- `class_id`: bet365 class id (F1 10, golf 7, cycling 38, American football 12, baseball 16, ice hockey 17, basketball 18, rugby union 8, rugby league 19, Australian rules 36).
- `count`: Number of quotes.
- `event_id`: bet365 event id (the drilled body&#39;s EV FI).
- `event_name`: Event name, for example &#39;Bahrain Grand Prix&#39;, &#39;NFL 2026/27&#39;, &#39;AFL 2027&#39;, &#39;World Cup 2027&#39;.
- `final_score`: The last scoreline seen (aggregate home-away; a comma-separated set list for set sports; for cricket bet365&#39;s Australian wickets/runs per innings in batting order, for example 7/199,8/141). For table tennis, badminton and volleyball the deciding set is included even though bet365 delists the match before adding it to its completed-set field.

### Status

Results: Status and cache size.

SDK operations: `load`.

Key fields to recognise:

- `last_fixture_seen_by_sport`: Per sport, the most recent time a fixture for that sport was seen in a catalog sweep. A recent timestamp means the sport is being read (a quiet off-week); a stale or missing one suggests a broken sport.
- `warming`: True right after a restart while the board loads.

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| BetBuilder | `create` | `POST /betbuilder/price` | Required |
| Odd | `list` | `GET /closing` | Not required |
| Odd | `list` | `GET /history` | Not required |
| Odd | `list` | `GET /results` | Not required |
| Odd | `list` | `GET /catalog` | Not required |
| Odd | `list` | `GET /odds` | Not required |
| Odd | `list` | `GET /outrights` | Not required |
| Odd | `load` | `GET /snapshot` | Not required |
| Status | `load` | `GET /health` | Not required |

## Connect to the API

- API server: `https://moviodds.com`

The default credential is sent in the `X-API-Key` header.

Only for /betbuilder/price. Ask @Movisu on Discord.

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

A read request without required parameters or authentication is `GET /catalog`. For example:

```sh
curl --fail-with-body --silent --show-error 'https://moviodds.com/catalog'
```

Inspect the response using the Odd reference. This checks the public route; authenticated operations need their own credentials and request data.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| Golang | `go/` | Build from source |
| Lua | `lua/` | Build from source |
| PHP | `php/` | Build from source |
| Python | `py/` | Build from source |
| Ruby | `rb/` | Build from source |
| TypeScript | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Companion tools

These targets provide another way to use the API. Their available commands or tools can cover a smaller set of operations than the client libraries.

### Go CLI

Use the command-line interface for shell-based tasks and scripts.

Repository directory: `go-cli/`. Not published. Build from the go-cli directory.


### Go MCP server

Use the MCP server to expose supported API operations to an MCP client.

Repository directory: `go-mcp/`. Not published. Build from the go-mcp directory.

- `moviodds-odds_list`: List records for an entity. Supported entities: `odd`.
- `moviodds-odds_load`: Load one record for an entity. Supported entities: `odd`, `status`.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- `ratelimit`: Client-side rate limiting via a token bucket
- `retry`: Automatic retry of transient failures with exponential backoff
- `test`: In-memory mock transport for testing without a live server
- `timeout`: Per-request timeout with transport abort

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the first-call guide for the setup sequence.
- Read the authentication guide before using protected routes.
- Use the API reference for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

