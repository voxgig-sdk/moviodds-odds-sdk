package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "MovioddsOdds",
			"slug": "moviodds-odds",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"ratelimit": map[string]any{
				"options": map[string]any{
					"active": false,
					"burst": 5,
					"rate": 5,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"retry": map[string]any{
				"options": map[string]any{
					"active": false,
					"factor": 2,
					"maxDelay": 2000,
					"minDelay": 50,
					"retries": 2,
					"statuses": []any{
						408,
						425,
						429,
						500,
						502,
						503,
						504,
					},
				},
				"optspec": map[string]any{
					"jitter": "`$BOOLEAN`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"entity": "`$MAP`",
					"net": "`$MAP`",
				},
				"strict": false,
				"transport": "base",
			},
			"timeout": map[string]any{
				"options": map[string]any{
					"active": false,
					"ms": 30000,
				},
				"optspec": map[string]any{
					"clearTimer": "`$FUNCTION`",
					"now": "`$FUNCTION`",
					"setTimer": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
		},
		"options": map[string]any{
			"base": "https://moviodds.com",
			"auth": map[string]any{
				"prefix": "",
				"name": "X-API-Key",
			},
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"bet_builder": map[string]any{},
				"odd": map[string]any{},
				"status": map[string]any{},
			},
		},
		"entity": map[string]any{
			"bet_builder": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "results",
						"title": "Results",
						"type": "`$ARRAY`",
						"req": true,
					},
					map[string]any{
						"name": "server_time",
						"title": "Server Time",
						"type": "`$STRING`",
						"req": true,
						"format": "date-time",
					},
					map[string]any{
						"name": "slips",
						"title": "Slips",
						"type": "`$ARRAY`",
						"req": true,
					},
				},
				"name": "bet_builder",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "POST",
								"orig": "/betbuilder/price",
								"segments": []any{
									map[string]any{
										"lit": "betbuilder",
									},
									map[string]any{
										"lit": "price",
									},
								},
								"parts": []any{
									"betbuilder",
									"price",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"odd": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "away",
						"title": "Away",
						"type": "`$STRING`",
						"op": map[string]any{
							"list": map[string]any{
								"req": true,
								"type": "`$STRING`",
							},
						},
					},
					map[string]any{
						"name": "class_id",
						"title": "Class Id",
						"type": "`$STRING`",
						"req": true,
						"short": "bet365 class id (F1 10, golf 7, cycling 38, American football 12, baseball 16, ice hockey 17, basketball 18, rugby union 8, rugby league 19, Australian rules 36).",
					},
					map[string]any{
						"name": "count",
						"title": "Count",
						"type": "`$INTEGER`",
						"req": true,
						"short": "Number of quotes.",
					},
					map[string]any{
						"name": "event_id",
						"title": "Event Id",
						"type": "`$STRING`",
						"req": true,
						"short": "bet365 event id (the drilled body's EV FI).",
					},
					map[string]any{
						"name": "event_name",
						"title": "Event Name",
						"type": "`$STRING`",
						"short": "Event name, e.g.",
					},
					map[string]any{
						"name": "final_score",
						"title": "Final Score",
						"type": "`$STRING`",
						"short": "The last scoreline seen (aggregate home-away; a comma-separated set list for set sports; for cricket bet365's Australian wickets/runs per innings in batting order, for example 7/199,8/141).",
					},
					map[string]any{
						"name": "finished_at",
						"title": "Finished At",
						"type": "`$STRING`",
						"short": "The last instant the match was seen live (≈ when it finished).",
						"format": "date-time",
					},
					map[string]any{
						"name": "fixture",
						"title": "Fixture",
						"type": "`$STRING`",
						"req": true,
					},
					map[string]any{
						"name": "fixture_id",
						"title": "Fixture Id",
						"type": "`$STRING`",
						"short": "The id that recorded this point.",
					},
					map[string]any{
						"name": "group_id",
						"title": "Group Id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "group_name",
						"title": "Group Name",
						"type": "`$STRING`",
						"short": "Market display name (same as /odds).",
					},
					map[string]any{
						"name": "groups",
						"title": "Groups",
						"type": "`$INTEGER`",
						"req": true,
						"short": "Number of markets.",
					},
					map[string]any{
						"name": "handicap",
						"title": "Handicap",
						"type": "`$STRING`",
						"short": "The handicap where applicable; same field as /odds.",
					},
					map[string]any{
						"name": "home",
						"title": "Home",
						"type": "`$STRING`",
						"op": map[string]any{
							"list": map[string]any{
								"req": true,
								"type": "`$STRING`",
							},
						},
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
						"req": true,
						"short": "bet365 match id.",
					},
					map[string]any{
						"name": "in_play",
						"title": "In Play",
						"type": "`$BOOLEAN`",
						"req": true,
						"short": "True while the match is actually under way.",
					},
					map[string]any{
						"name": "kickoff_estimated",
						"title": "Kickoff Estimated",
						"type": "`$BOOLEAN`",
						"short": "True when kickoff_utc is not bet365's scheduled start but an estimate derived from the live feed (the instant the match was first seen live), used only when the real start is unknown.",
					},
					map[string]any{
						"name": "kickoff_utc",
						"title": "Kickoff Utc",
						"type": "`$STRING`",
						"short": "The match's scheduled kickoff (UTC).",
						"format": "date-time",
					},
					map[string]any{
						"name": "label",
						"title": "Label",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "last",
						"title": "Last",
						"type": "`$OBJECT`",
						"req": true,
						"short": "One recorded price.",
					},
					map[string]any{
						"name": "last_seen",
						"title": "Last Seen",
						"type": "`$STRING`",
						"format": "date-time",
					},
					map[string]any{
						"name": "league",
						"title": "League",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "line",
						"title": "Line",
						"type": "`$STRING`",
						"short": "The market line where applicable (e.g.",
					},
					map[string]any{
						"name": "links",
						"title": "Links",
						"type": "`$OBJECT`",
						"short": "Ready-made bet365 deep links.",
					},
					map[string]any{
						"name": "market_count",
						"title": "Market Count",
						"type": "`$INTEGER`",
						"req": true,
						"short": "Markets priced for this match (unaffected by the groups filter).",
					},
					map[string]any{
						"name": "market_id",
						"title": "Market Id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "markets",
						"title": "Markets",
						"type": "`$ARRAY`",
						"req": true,
					},
					map[string]any{
						"name": "n2",
						"title": "N2",
						"type": "`$STRING`",
						"short": "Second participant where the market names one; same field as /odds.",
					},
					map[string]any{
						"name": "note",
						"title": "Note",
						"type": "`$STRING`",
						"short": "A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,…",
					},
					map[string]any{
						"name": "odds_dec",
						"title": "Odds Dec",
						"type": "`$NUMBER`",
						"req": true,
					},
					map[string]any{
						"name": "odds_frac",
						"title": "Odds Frac",
						"type": "`$STRING`",
						"short": "Derived display fraction; odds_dec is authoritative.",
					},
					map[string]any{
						"name": "overtime",
						"title": "Overtime",
						"type": "`$BOOLEAN`",
						"short": "Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it.",
					},
					map[string]any{
						"name": "periods",
						"title": "Periods",
						"type": "`$ARRAY`",
						"short": "Per-period / per-set scores where the sport exposes them.",
					},
					map[string]any{
						"name": "polled_at",
						"title": "Polled At",
						"type": "`$STRING`",
						"short": "When this match was last refreshed.",
						"format": "date-time",
					},
					map[string]any{
						"name": "pre_close",
						"title": "Pre Close",
						"type": "`$OBJECT`",
						"req": true,
						"short": "One recorded price.",
					},
					map[string]any{
						"name": "quotes",
						"title": "Quotes",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$ARRAY`",
								"`$NULL`",
							},
						},
						"op": map[string]any{
							"list": map[string]any{
								"req": true,
								"type": "`$ARRAY`",
							},
						},
					},
					map[string]any{
						"name": "region",
						"title": "Region",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "score",
						"title": "Score",
						"type": "`$STRING`",
						"short": "Live scoreline while in play, home-away.",
					},
					map[string]any{
						"name": "sel_id",
						"title": "Sel Id",
						"type": "`$STRING`",
						"req": true,
						"op": map[string]any{
							"list": map[string]any{
								"type": "`$STRING`",
							},
						},
					},
					map[string]any{
						"name": "server_time",
						"title": "Server Time",
						"type": "`$STRING`",
						"req": true,
						"format": "date-time",
					},
					map[string]any{
						"name": "side",
						"title": "Side",
						"type": "`$STRING`",
						"short": "Selection side where the market uses one (e.g.",
					},
					map[string]any{
						"name": "sport",
						"title": "Sport",
						"type": "`$STRING`",
						"op": map[string]any{
							"list": map[string]any{
								"req": true,
								"type": "`$STRING`",
							},
						},
					},
					map[string]any{
						"name": "status",
						"title": "Status",
						"type": "`$STRING`",
						"short": "finished: the match reached full time (a player or side won the required sets, baseball reached the 9th inning, or a cricket run result was derived).",
					},
					map[string]any{
						"name": "suspended",
						"title": "Suspended",
						"type": "`$BOOLEAN`",
						"req": true,
					},
					map[string]any{
						"name": "ts",
						"title": "Ts",
						"type": "`$STRING`",
						"req": true,
						"format": "date-time",
					},
					map[string]any{
						"name": "updated_at",
						"title": "Updated At",
						"type": "`$STRING`",
						"format": "date-time",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "odd",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/closing",
								"segments": []any{
									map[string]any{
										"lit": "closing",
									},
								},
								"parts": []any{
									"closing",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "fi",
											"orig": "fi",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "203238114",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"fi",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/history",
								"segments": []any{
									map[string]any{
										"lit": "history",
									},
								},
								"parts": []any{
									"history",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "fi",
											"orig": "fi",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "203238114",
										},
										map[string]any{
											"name": "from",
											"orig": "from",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "group",
											"orig": "group",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "limit",
											"orig": "limit",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 5000,
										},
										map[string]any{
											"name": "sel",
											"orig": "sel",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "to",
											"orig": "to",
											"type": "`$STRING`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"fi",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/results",
								"segments": []any{
									map[string]any{
										"lit": "results",
									},
								},
								"parts": []any{
									"results",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.results`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "date",
											"orig": "date",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "fi",
											"orig": "fi",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "sport",
											"orig": "sport",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "soccer",
											"field": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"sport",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/catalog",
								"segments": []any{
									map[string]any{
										"lit": "catalog",
									},
								},
								"parts": []any{
									"catalog",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.fixtures`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "sport",
											"orig": "sport",
											"type": "`$STRING`",
											"kind": "query",
											"example": "soccer",
											"field": true,
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/odds",
								"segments": []any{
									map[string]any{
										"lit": "odds",
									},
								},
								"parts": []any{
									"odds",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.matches`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "group",
											"orig": "groups",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "in_play",
											"orig": "in_play",
											"type": "`$STRING`",
											"kind": "query",
											"field": true,
										},
										map[string]any{
											"name": "link",
											"orig": "links",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "sport",
											"orig": "sport",
											"type": "`$STRING`",
											"kind": "query",
											"example": "soccer",
											"field": true,
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/outrights",
								"segments": []any{
									map[string]any{
										"lit": "outrights",
									},
								},
								"parts": []any{
									"outrights",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.events`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "sport",
											"orig": "sport",
											"type": "`$STRING`",
											"kind": "query",
											"example": "all",
											"field": true,
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/snapshot",
								"segments": []any{
									map[string]any{
										"lit": "snapshot",
									},
								},
								"parts": []any{
									"snapshot",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "fi",
											"orig": "fi",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "203363787",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"fi",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"status": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "cache_fixtures",
						"title": "Cache Fixtures",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "cache_quotes",
						"title": "Cache Quotes",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "catalog_fixtures",
						"title": "Catalog Fixtures",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "last_change_unix",
						"title": "Last Change Unix",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "last_fixture_seen_by_sport",
						"title": "Last Fixture Seen By Sport",
						"type": "`$OBJECT`",
						"short": "Per sport, the most recent time a fixture for that sport was seen in a catalog sweep.",
					},
					map[string]any{
						"name": "status",
						"title": "Status",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "warming",
						"title": "Warming",
						"type": "`$BOOLEAN`",
						"short": "True right after a restart while the board loads.",
					},
				},
				"name": "status",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/health",
								"segments": []any{
									map[string]any{
										"lit": "health",
									},
								},
								"parts": []any{
									"health",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
		},
	}
}

// The plugin definitions the model selected per feature, as []any so a
// feature package can consume them without core naming its types. Empty
// when no active feature declares active plugin groups for this target.
var featurePlugins = map[string][]any{
}

// FeaturePlugins is the definitions list for one feature's chain.
func FeaturePlugins(name string) []any {
	return featurePlugins[name]
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "ratelimit":
		if NewRatelimitFeatureFunc != nil {
			return NewRatelimitFeatureFunc()
		}
	case "retry":
		if NewRetryFeatureFunc != nil {
			return NewRetryFeatureFunc()
		}
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	case "timeout":
		if NewTimeoutFeatureFunc != nil {
			return NewTimeoutFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
