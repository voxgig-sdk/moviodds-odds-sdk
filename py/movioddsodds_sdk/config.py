# MovioddsOdds SDK configuration


# The sekreto plugin DEFINITIONS the model selected per feature, imported
# above by name from the modules the catalogue's active `plugin.def`
# entries declare. Handed to each feature (secrets builds its Sekreto
# with them): a provider kind not listed here is unknown to that SDK.
FEATURE_PLUGINS = {
}


_shared_config = None


def shared_config():
    """Return the process-wide config, built once on first use.

    The SDK reads the config on every request and never writes to it, so one
    instance is shared by every client rather than rebuilt per client.

    The returned dict is shared: treat it as read-only. Callers that need to
    mutate should use make_config, which always returns a fresh copy.
    """
    global _shared_config
    if _shared_config is None:
        _shared_config = make_config()
    return _shared_config


def make_config():
    """Build a fresh, fully materialised config dict.

    Every call rebuilds the whole structure, so prefer shared_config unless
    you need a private copy you intend to mutate.
    """
    return {
        "main": {
            "name": "MovioddsOdds",
            "slug": "moviodds-odds",
            "version": "0.0.1",
            "target": "py",
        },
        "feature": {
            "ratelimit": {
        "options": {
          "active": False,
          "burst": 5,
          "rate": 5,
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "retry": {
        "options": {
          "active": False,
          "factor": 2,
          "maxDelay": 2000,
          "minDelay": 50,
          "retries": 2,
          "statuses": [
            408,
            425,
            429,
            500,
            502,
            503,
            504,
          ],
        },
        "optspec": {
          "jitter": "`$BOOLEAN`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "test": {
        "options": {
          "active": False,
        },
        "optspec": {
          "entity": "`$MAP`",
          "net": "`$MAP`",
        },
        "strict": False,
        "transport": "base",
      },
            "timeout": {
        "options": {
          "active": False,
          "ms": 30000,
        },
        "optspec": {
          "clearTimer": "`$FUNCTION`",
          "now": "`$FUNCTION`",
          "setTimer": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
        },
        "options": {
            "base": "https://moviodds.com",
            "auth": {
                "prefix": "",
                "name": "X-API-Key",
            },
            "headers": {
        "content-type": "application/json",
      },
            "entity": {
                "bet_builder": {},
                "odd": {},
                "status": {},
            },
        },
        "entity": {
      "bet_builder": {
        "fields": [
          {
            "name": "results",
            "title": "Results",
            "type": "`$ARRAY`",
            "req": True,
          },
          {
            "name": "server_time",
            "title": "Server Time",
            "type": "`$STRING`",
            "req": True,
            "format": "date-time",
          },
          {
            "name": "slips",
            "title": "Slips",
            "type": "`$ARRAY`",
            "req": True,
          },
        ],
        "name": "bet_builder",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/betbuilder/price",
                "segments": [
                  {
                    "lit": "betbuilder",
                  },
                  {
                    "lit": "price",
                  },
                ],
                "parts": [
                  "betbuilder",
                  "price",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {},
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "odd": {
        "fields": [
          {
            "name": "away",
            "title": "Away",
            "type": "`$STRING`",
            "op": {
              "list": {
                "req": True,
                "type": "`$STRING`",
              },
            },
          },
          {
            "name": "class_id",
            "title": "Class Id",
            "type": "`$STRING`",
            "req": True,
            "short": "bet365 class id (F1 10, golf 7, cycling 38, American football 12, baseball 16, ice hockey 17, basketball 18, rugby union 8, rugby league 19, Australian rules 36).",
          },
          {
            "name": "count",
            "title": "Count",
            "type": "`$INTEGER`",
            "req": True,
            "short": "Number of quotes.",
          },
          {
            "name": "event_id",
            "title": "Event Id",
            "type": "`$STRING`",
            "req": True,
            "short": "bet365 event id (the drilled body's EV FI).",
          },
          {
            "name": "event_name",
            "title": "Event Name",
            "type": "`$STRING`",
            "short": "Event name, e.g.",
          },
          {
            "name": "final_score",
            "title": "Final Score",
            "type": "`$STRING`",
            "short": "The last scoreline seen (aggregate home-away; a comma-separated set list for set sports; for cricket bet365's Australian wickets/runs per innings in batting order, for example 7/199,8/141).",
          },
          {
            "name": "finished_at",
            "title": "Finished At",
            "type": "`$STRING`",
            "short": "The last instant the match was seen live (≈ when it finished).",
            "format": "date-time",
          },
          {
            "name": "fixture",
            "title": "Fixture",
            "type": "`$STRING`",
            "req": True,
          },
          {
            "name": "fixture_id",
            "title": "Fixture Id",
            "type": "`$STRING`",
            "short": "The id that recorded this point.",
          },
          {
            "name": "group_id",
            "title": "Group Id",
            "type": "`$STRING`",
          },
          {
            "name": "group_name",
            "title": "Group Name",
            "type": "`$STRING`",
            "short": "Market display name (same as /odds).",
          },
          {
            "name": "groups",
            "title": "Groups",
            "type": "`$INTEGER`",
            "req": True,
            "short": "Number of markets.",
          },
          {
            "name": "handicap",
            "title": "Handicap",
            "type": "`$STRING`",
            "short": "The handicap where applicable; same field as /odds.",
          },
          {
            "name": "home",
            "title": "Home",
            "type": "`$STRING`",
            "op": {
              "list": {
                "req": True,
                "type": "`$STRING`",
              },
            },
          },
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
            "req": True,
            "short": "bet365 match id.",
          },
          {
            "name": "in_play",
            "title": "In Play",
            "type": "`$BOOLEAN`",
            "req": True,
            "short": "True while the match is actually under way.",
          },
          {
            "name": "kickoff_estimated",
            "title": "Kickoff Estimated",
            "type": "`$BOOLEAN`",
            "short": "True when kickoff_utc is not bet365's scheduled start but an estimate derived from the live feed (the instant the match was first seen live), used only when the real start is unknown.",
          },
          {
            "name": "kickoff_utc",
            "title": "Kickoff Utc",
            "type": "`$STRING`",
            "short": "The match's scheduled kickoff (UTC).",
            "format": "date-time",
          },
          {
            "name": "label",
            "title": "Label",
            "type": "`$STRING`",
          },
          {
            "name": "last",
            "title": "Last",
            "type": "`$OBJECT`",
            "req": True,
            "short": "One recorded price.",
          },
          {
            "name": "last_seen",
            "title": "Last Seen",
            "type": "`$STRING`",
            "format": "date-time",
          },
          {
            "name": "league",
            "title": "League",
            "type": "`$STRING`",
          },
          {
            "name": "line",
            "title": "Line",
            "type": "`$STRING`",
            "short": "The market line where applicable (e.g.",
          },
          {
            "name": "links",
            "title": "Links",
            "type": "`$OBJECT`",
            "short": "Ready-made bet365 deep links.",
          },
          {
            "name": "market_count",
            "title": "Market Count",
            "type": "`$INTEGER`",
            "req": True,
            "short": "Markets priced for this match (unaffected by the groups filter).",
          },
          {
            "name": "market_id",
            "title": "Market Id",
            "type": "`$STRING`",
          },
          {
            "name": "markets",
            "title": "Markets",
            "type": "`$ARRAY`",
            "req": True,
          },
          {
            "name": "n2",
            "title": "N2",
            "type": "`$STRING`",
            "short": "Second participant where the market names one; same field as /odds.",
          },
          {
            "name": "note",
            "title": "Note",
            "type": "`$STRING`",
            "short": "A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,…",
          },
          {
            "name": "odds_dec",
            "title": "Odds Dec",
            "type": "`$NUMBER`",
            "req": True,
          },
          {
            "name": "odds_frac",
            "title": "Odds Frac",
            "type": "`$STRING`",
            "short": "Derived display fraction; odds_dec is authoritative.",
          },
          {
            "name": "overtime",
            "title": "Overtime",
            "type": "`$BOOLEAN`",
            "short": "Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it.",
          },
          {
            "name": "periods",
            "title": "Periods",
            "type": "`$ARRAY`",
            "short": "Per-period / per-set scores where the sport exposes them.",
          },
          {
            "name": "polled_at",
            "title": "Polled At",
            "type": "`$STRING`",
            "short": "When this match was last refreshed.",
            "format": "date-time",
          },
          {
            "name": "pre_close",
            "title": "Pre Close",
            "type": "`$OBJECT`",
            "req": True,
            "short": "One recorded price.",
          },
          {
            "name": "quotes",
            "title": "Quotes",
            "type": [
              "`$ONE`",
              [
                "`$ARRAY`",
                "`$NULL`",
              ],
            ],
            "op": {
              "list": {
                "req": True,
                "type": "`$ARRAY`",
              },
            },
          },
          {
            "name": "region",
            "title": "Region",
            "type": "`$STRING`",
          },
          {
            "name": "score",
            "title": "Score",
            "type": "`$STRING`",
            "short": "Live scoreline while in play, home-away.",
          },
          {
            "name": "sel_id",
            "title": "Sel Id",
            "type": "`$STRING`",
            "req": True,
            "op": {
              "list": {
                "type": "`$STRING`",
              },
            },
          },
          {
            "name": "server_time",
            "title": "Server Time",
            "type": "`$STRING`",
            "req": True,
            "format": "date-time",
          },
          {
            "name": "side",
            "title": "Side",
            "type": "`$STRING`",
            "short": "Selection side where the market uses one (e.g.",
          },
          {
            "name": "sport",
            "title": "Sport",
            "type": "`$STRING`",
            "op": {
              "list": {
                "req": True,
                "type": "`$STRING`",
              },
            },
          },
          {
            "name": "status",
            "title": "Status",
            "type": "`$STRING`",
            "short": "finished: the match reached full time (a player or side won the required sets, baseball reached the 9th inning, or a cricket run result was derived).",
          },
          {
            "name": "suspended",
            "title": "Suspended",
            "type": "`$BOOLEAN`",
            "req": True,
          },
          {
            "name": "ts",
            "title": "Ts",
            "type": "`$STRING`",
            "req": True,
            "format": "date-time",
          },
          {
            "name": "updated_at",
            "title": "Updated At",
            "type": "`$STRING`",
            "format": "date-time",
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
        },
        "name": "odd",
        "op": {
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/closing",
                "segments": [
                  {
                    "lit": "closing",
                  },
                ],
                "parts": [
                  "closing",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "query": [
                    {
                      "name": "fi",
                      "orig": "fi",
                      "type": "`$STRING`",
                      "kind": "query",
                      "reqd": True,
                      "example": "203238114",
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "fi",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
              {
                "kind": "http",
                "method": "GET",
                "orig": "/history",
                "segments": [
                  {
                    "lit": "history",
                  },
                ],
                "parts": [
                  "history",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "query": [
                    {
                      "name": "fi",
                      "orig": "fi",
                      "type": "`$STRING`",
                      "kind": "query",
                      "reqd": True,
                      "example": "203238114",
                    },
                    {
                      "name": "from",
                      "orig": "from",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                    {
                      "name": "group",
                      "orig": "group",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                    {
                      "name": "limit",
                      "orig": "limit",
                      "type": "`$INTEGER`",
                      "kind": "query",
                      "example": 5000,
                    },
                    {
                      "name": "sel",
                      "orig": "sel",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                    {
                      "name": "to",
                      "orig": "to",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "fi",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
              {
                "kind": "http",
                "method": "GET",
                "orig": "/results",
                "segments": [
                  {
                    "lit": "results",
                  },
                ],
                "parts": [
                  "results",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.results`",
                },
                "args": {
                  "query": [
                    {
                      "name": "date",
                      "orig": "date",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                    {
                      "name": "fi",
                      "orig": "fi",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                    {
                      "name": "sport",
                      "orig": "sport",
                      "type": "`$STRING`",
                      "kind": "query",
                      "reqd": True,
                      "example": "soccer",
                      "field": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "sport",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
              {
                "kind": "http",
                "method": "GET",
                "orig": "/catalog",
                "segments": [
                  {
                    "lit": "catalog",
                  },
                ],
                "parts": [
                  "catalog",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.fixtures`",
                },
                "args": {
                  "query": [
                    {
                      "name": "sport",
                      "orig": "sport",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "soccer",
                      "field": True,
                    },
                  ],
                },
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
              {
                "kind": "http",
                "method": "GET",
                "orig": "/odds",
                "segments": [
                  {
                    "lit": "odds",
                  },
                ],
                "parts": [
                  "odds",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.matches`",
                },
                "args": {
                  "query": [
                    {
                      "name": "group",
                      "orig": "groups",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                    {
                      "name": "in_play",
                      "orig": "in_play",
                      "type": "`$STRING`",
                      "kind": "query",
                      "field": True,
                    },
                    {
                      "name": "link",
                      "orig": "links",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                    {
                      "name": "sport",
                      "orig": "sport",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "soccer",
                      "field": True,
                    },
                  ],
                },
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
              {
                "kind": "http",
                "method": "GET",
                "orig": "/outrights",
                "segments": [
                  {
                    "lit": "outrights",
                  },
                ],
                "parts": [
                  "outrights",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.events`",
                },
                "args": {
                  "query": [
                    {
                      "name": "sport",
                      "orig": "sport",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "all",
                      "field": True,
                    },
                  ],
                },
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/snapshot",
                "segments": [
                  {
                    "lit": "snapshot",
                  },
                ],
                "parts": [
                  "snapshot",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "query": [
                    {
                      "name": "fi",
                      "orig": "fi",
                      "type": "`$STRING`",
                      "kind": "query",
                      "reqd": True,
                      "example": "203363787",
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "fi",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "status": {
        "fields": [
          {
            "name": "cache_fixtures",
            "title": "Cache Fixtures",
            "type": "`$INTEGER`",
          },
          {
            "name": "cache_quotes",
            "title": "Cache Quotes",
            "type": "`$INTEGER`",
          },
          {
            "name": "catalog_fixtures",
            "title": "Catalog Fixtures",
            "type": "`$INTEGER`",
          },
          {
            "name": "last_change_unix",
            "title": "Last Change Unix",
            "type": "`$INTEGER`",
          },
          {
            "name": "last_fixture_seen_by_sport",
            "title": "Last Fixture Seen By Sport",
            "type": "`$OBJECT`",
            "short": "Per sport, the most recent time a fixture for that sport was seen in a catalog sweep.",
          },
          {
            "name": "status",
            "title": "Status",
            "type": "`$STRING`",
          },
          {
            "name": "warming",
            "title": "Warming",
            "type": "`$BOOLEAN`",
            "short": "True right after a restart while the board loads.",
          },
        ],
        "name": "status",
        "op": {
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/health",
                "segments": [
                  {
                    "lit": "health",
                  },
                ],
                "parts": [
                  "health",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {},
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
    },
    }
