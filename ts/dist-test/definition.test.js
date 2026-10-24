"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const __1 = require("..");
const definition_runner_1 = require("./definition-runner");
const utility_1 = require("./utility");
// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN = [
    {
        "entity": "bet_builder",
        "accessor": "BetBuilder",
        "op": "create",
        "method": "POST",
        "path": "/betbuilder/price",
        "args": [],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "x-api-key"
                }
            ]
        ],
        "status": 200,
        "sample": {
            "server_time": "2026-01-01T00:00:00Z",
            "results": [
                {
                    "fixture": "x",
                    "home": "x",
                    "away": "x",
                    "legs": [
                        {
                            "sel_id": "x",
                            "market": "x",
                            "label": "x",
                            "odds_dec": 1
                        }
                    ],
                    "status": "priced",
                    "odds_dec": 1,
                    "odds_frac": "x",
                    "naive_odds_dec": 1,
                    "priced_at": "2026-01-01T00:00:00Z",
                    "error": "x",
                    "retryable": true
                }
            ]
        },
        "idField": "id"
    },
    {
        "entity": "odd",
        "accessor": "Odd",
        "op": "list",
        "method": "GET",
        "path": "/results",
        "args": [],
        "select": {
            "sport": "soccer",
            "date": "v1"
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "sport",
            "date",
            "fi"
        ],
        "queryArgs": [
            {
                "name": "date",
                "wire": "date"
            },
            {
                "name": "sport",
                "wire": "sport"
            }
        ],
        "auth": [],
        "status": 200,
        "sample": {
            "sport": "x",
            "date": "x",
            "count": 1,
            "results": [
                {
                    "fixture_id": "x",
                    "sport": "x",
                    "home": "x",
                    "away": "x",
                    "league": "x",
                    "final_score": "x",
                    "periods": [
                        {
                            "name": "x",
                            "score": "x"
                        }
                    ],
                    "status": "finished",
                    "overtime": true,
                    "note": "x",
                    "finished_at": "2026-01-01T00:00:00Z",
                    "updated_at": "2026-01-01T00:00:00Z"
                }
            ]
        },
        "idField": "id"
    },
    {
        "entity": "odd",
        "accessor": "Odd",
        "op": "load",
        "method": "GET",
        "path": "/snapshot",
        "args": [],
        "select": {
            "fi": "203363787"
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "fi"
        ],
        "queryArgs": [
            {
                "name": "fi",
                "wire": "fi"
            }
        ],
        "auth": [],
        "status": 200,
        "sample": {
            "fixture": "x",
            "count": 1,
            "groups": 1,
            "server_time": "2026-01-01T00:00:00Z",
            "polled_at": "2026-01-01T00:00:00Z",
            "quotes": [
                {
                    "fixture_id": "x",
                    "group_id": "x",
                    "group_name": "x",
                    "market_id": "x",
                    "sel_id": "x",
                    "label": "x",
                    "n2": "x",
                    "handicap": "x",
                    "side": "x",
                    "line": "x",
                    "odds_dec": 1,
                    "odds_frac": "x",
                    "suspended": true,
                    "ts": "2026-01-01T00:00:00Z"
                }
            ]
        },
        "idField": "id"
    },
    {
        "entity": "status",
        "accessor": "Status",
        "op": "load",
        "method": "GET",
        "path": "/health",
        "args": [],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": [],
        "status": 200,
        "sample": {
            "status": "x",
            "warming": true,
            "catalog_fixtures": 1,
            "cache_fixtures": 1,
            "cache_quotes": 1,
            "last_change_unix": 1,
            "last_fixture_seen_by_sport": {}
        },
        "idField": "id"
    }
];
(0, node_test_1.describe)('definition', () => {
    for (const point of PLAN) {
        (0, node_test_1.test)(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
            const control = (0, utility_1.isControlSkipped)('entityOp', point.entity + '.' + point.op, 'definition');
            if (control.skip) {
                t.skip(control.reason || 'skipped via sdk-test-control.json');
                return;
            }
            await (0, definition_runner_1.runDefinitionPoint)(__1.SDK, point);
        });
    }
});
//# sourceMappingURL=definition.test.js.map