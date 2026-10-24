"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('StatusEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when MOVIODDS_ODDS_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('MOVIODDS_ODDS_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.MovioddsOddsSDK.test();
        const ent = testsdk.Status();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.MovioddsOddsSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Status().load({ "cache_fixtures": "x" }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.MOVIODDS_ODDS_TEST_LIVE;
        for (const op of ['load']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'status.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "cache_fixtures": { "a": true, "h": "Cache Fixtures", "n": "cache_fixtures", "r": false, "t": "`$INTEGER`", "key$": "cache_fixtures", "index$": 0 }, "cache_quotes": { "a": true, "h": "Cache Quotes", "n": "cache_quotes", "r": false, "t": "`$INTEGER`", "key$": "cache_quotes", "index$": 1 }, "catalog_fixtures": { "a": true, "h": "Catalog Fixtures", "n": "catalog_fixtures", "r": false, "t": "`$INTEGER`", "key$": "catalog_fixtures", "index$": 2 }, "last_change_unix": { "a": true, "h": "Last Change Unix", "n": "last_change_unix", "r": false, "t": "`$INTEGER`", "key$": "last_change_unix", "index$": 3 }, "last_fixture_seen_by_sport": { "a": true, "h": "Last Fixture Seen By Sport", "n": "last_fixture_seen_by_sport", "r": false, "sh": "Per sport, the most recent time a fixture for that sport was seen in a catalog sweep.", "t": "`$OBJECT`", "key$": "last_fixture_seen_by_sport", "index$": 4 }, "status": { "a": true, "h": "Status", "n": "status", "r": false, "t": "`$STRING`", "key$": "status", "index$": 5 }, "warming": { "a": true, "h": "Warming", "n": "warming", "r": false, "sh": "True right after a restart while the board loads.", "t": "`$BOOLEAN`", "key$": "warming", "index$": 6 } }, "name": "status", "op": { "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /health", "source": "openapi3", "version": 2 }, "g": {}, "k": "http", "m": "GET", "o": "/health", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "health" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "status", "name__orig": "status", "Name": "Status", "name_": "status", "name-": "status", "NAME": "STATUS", "index$": 2 }, { "active": true, "entity": "status", "key$": "BasicStatusFlow", "kind": "basic", "name": "BasicStatusFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "status_ref01", "srcdatavar": "status_ref01_data", "suffix": "_dt0" }, "m": {}, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-status_ref01" } }], "index$": 0 }] }, 'Status', { "GET /health": { "protocol": "http", "parameters": [] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let status_ref01_data = Object.values(setup.data.existing.status)[0];
        // LOAD
        const status_ref01_ent = client.Status();
        const status_ref01_match_dt0 = {};
        const status_ref01_data_dt0 = (await status_ref01_ent.load(status_ref01_match_dt0)).data();
        (0, node_assert_1.default)(null != status_ref01_data_dt0);
    });
});
// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true;
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/status/StatusTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.MovioddsOddsSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['status01', 'status02', 'status03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'MOVIODDS_ODDS_TEST_STATUS_ENTID': idmap,
        'MOVIODDS_ODDS_TEST_LIVE': 'FALSE',
        'MOVIODDS_ODDS_TEST_EXPLAIN': 'FALSE',
        'MOVIODDS_ODDS_APIKEY': '',
    });
    idmap = env['MOVIODDS_ODDS_TEST_STATUS_ENTID'];
    const live = 'TRUE' === env.MOVIODDS_ODDS_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['MOVIODDS_ODDS_TEST_STATUS_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.MovioddsOddsSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {
                apikey: env.MOVIODDS_ODDS_APIKEY,
            },
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
    }
    const setup = {
        idmap,
        env,
        options,
        client,
        struct,
        data: entityData,
        explain: 'TRUE' === env.MOVIODDS_ODDS_TEST_EXPLAIN,
        live,
        transport,
        now: Date.now(),
    };
    return setup;
}
//# sourceMappingURL=StatusEntity.test.js.map