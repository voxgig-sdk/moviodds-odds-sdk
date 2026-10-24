package sdktest

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/moviodds-odds-sdk/go"
	"github.com/voxgig-sdk/moviodds-odds-sdk/go/core"

	vs "github.com/voxgig-sdk/moviodds-odds-sdk/go/utility/struct"
)

// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const bet_builderEntityLiveStrict = true


func TestBetBuilderEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.BetBuilder(nil)
		if ent == nil {
			t.Fatal("expected non-nil BetBuilderEntity")
		}
	})

	t.Run("basic", func(tt *testing.T) {
		var t testing.TB = tt
		setup := bet_builderBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "bet_builder." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		client := setup.client
		_ = client

		// CREATE
		betBuilderRef01Ent := client.BetBuilder(nil)
		betBuilderRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "bet_builder"}), "bet_builder_ref01"))

		betBuilderRef01DataResult, err := betBuilderRef01Ent.Create(betBuilderRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		betBuilderRef01Data = core.ToMapAny(entityData(betBuilderRef01DataResult))
		if betBuilderRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}

	})
}

func bet_builderBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "bet_builder", "BetBuilderTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read bet_builder test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse bet_builder test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"bet_builder01", "bet_builder02", "bet_builder03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Whether *_ENTID supplied the idmap, read before envOverride consumes it:
	// without it, the ids a live flow binds are the fixture's synthetic ones.
	entidEnvRaw := os.Getenv("MOVIODDS_ODDS_TEST_BET_BUILDER_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"MOVIODDS_ODDS_TEST_BET_BUILDER_ENTID": idmap,
		"MOVIODDS_ODDS_TEST_LIVE":      "FALSE",
		"MOVIODDS_ODDS_TEST_EXPLAIN":   "FALSE",
		"MOVIODDS_ODDS_APIKEY":         "",
	})

	idmapResolved := core.ToMapAny(env["MOVIODDS_ODDS_TEST_BET_BUILDER_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["MOVIODDS_ODDS_TEST_LIVE"] == "TRUE" {
		// An empty map, not a nil one: Merge returns nil when its last entry
		// is nil, and BasicSetup is normally called with no extras - so a
		// bare nil silently discarded the apikey and server values below.
		extraOpts := extra
		if extraOpts == nil {
			extraOpts = map[string]any{}
		}

		mergedOpts := vs.Merge([]any{
			// liveClientOptions() FIRST, so the generated fields below win:
			// sdk-test-control.json's test.client.options adds to the live
			// client, it does not redirect it.
			liveClientOptions(),
			map[string]any{
				"apikey": env["MOVIODDS_ODDS_APIKEY"],
			},
			extraOpts,
		})
		client = sdk.NewMovioddsOddsSDK(core.ToMapAny(mergedOpts))
	}

	live := env["MOVIODDS_ODDS_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["MOVIODDS_ODDS_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
