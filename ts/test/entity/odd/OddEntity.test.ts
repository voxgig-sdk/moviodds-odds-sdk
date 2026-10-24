

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { MovioddsOddsSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('OddEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when MOVIODDS_ODDS_TEST_LIVE=TRUE.
  afterEach(liveDelay('MOVIODDS_ODDS_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = MovioddsOddsSDK.test()
    const ent = testsdk.Odd()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('odd hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of MovioddsOddsSDK.test(offline).Odd().stream('list')) { }
    }, /offline/)

    for await (const _item of MovioddsOddsSDK.test(offline).Odd()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = MovioddsOddsSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Odd().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of MovioddsOddsSDK.test().Odd().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new MovioddsOddsSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Odd().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Odd().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = MovioddsOddsSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Odd().list({"fi":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.MOVIODDS_ODDS_TEST_LIVE
    for (const op of ['list', 'load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'odd.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"away":{"a":true,"h":"Away","n":"away","op":{"list":{"req":true,"type":"`$STRING`"}},"r":false,"t":"`$STRING`","key$":"away","index$":0},"class_id":{"a":true,"h":"Class Id","n":"class_id","r":true,"sh":"bet365 class id (F1 10, golf 7, cycling 38, American football 12, baseball 16, ice hockey 17, basketball 18, rugby union 8, rugby league 19, Australian rules 36).","t":"`$STRING`","key$":"class_id","index$":1},"count":{"a":true,"h":"Count","n":"count","r":true,"sh":"Number of quotes.","t":"`$INTEGER`","key$":"count","index$":2},"event_id":{"a":true,"h":"Event Id","n":"event_id","r":true,"sh":"bet365 event id (the drilled body's EV FI).","t":"`$STRING`","key$":"event_id","index$":3},"event_name":{"a":true,"h":"Event Name","n":"event_name","r":false,"sh":"Event name, e.g.","t":"`$STRING`","key$":"event_name","index$":4},"final_score":{"a":true,"h":"Final Score","n":"final_score","r":false,"sh":"The last scoreline seen (aggregate home-away; a comma-separated set list for set sports; for cricket bet365's Australian wickets/runs per innings in batting order, for example 7/199,8/141).","t":"`$STRING`","key$":"final_score","index$":5},"finished_at":{"a":true,"fo":"date-time","h":"Finished At","n":"finished_at","r":false,"sh":"The last instant the match was seen live (≈ when it finished).","t":"`$STRING`","key$":"finished_at","index$":6},"fixture":{"a":true,"h":"Fixture","n":"fixture","r":true,"t":"`$STRING`","key$":"fixture","index$":7},"fixture_id":{"a":true,"h":"Fixture Id","n":"fixture_id","r":false,"sh":"The id that recorded this point.","t":"`$STRING`","key$":"fixture_id","index$":8},"group_id":{"a":true,"h":"Group Id","n":"group_id","r":false,"t":"`$STRING`","key$":"group_id","index$":9},"group_name":{"a":true,"h":"Group Name","n":"group_name","r":false,"sh":"Market display name (same as /odds).","t":"`$STRING`","key$":"group_name","index$":10},"groups":{"a":true,"h":"Groups","n":"groups","r":true,"sh":"Number of markets.","t":"`$INTEGER`","key$":"groups","index$":11},"handicap":{"a":true,"h":"Handicap","n":"handicap","r":false,"sh":"The handicap where applicable; same field as /odds.","t":"`$STRING`","key$":"handicap","index$":12},"home":{"a":true,"h":"Home","n":"home","op":{"list":{"req":true,"type":"`$STRING`"}},"r":false,"t":"`$STRING`","key$":"home","index$":13},"id":{"a":true,"h":"Id","n":"id","r":true,"sh":"bet365 match id.","t":"`$STRING`","key$":"id","index$":14},"in_play":{"a":true,"h":"In Play","n":"in_play","r":true,"sh":"True while the match is actually under way.","t":"`$BOOLEAN`","key$":"in_play","index$":15},"kickoff_estimated":{"a":true,"h":"Kickoff Estimated","n":"kickoff_estimated","r":false,"sh":"True when kickoff_utc is not bet365's scheduled start but an estimate derived from the live feed (the instant the match was first seen live), used only when the real start is unknown.","t":"`$BOOLEAN`","key$":"kickoff_estimated","index$":16},"kickoff_utc":{"a":true,"fo":"date-time","h":"Kickoff Utc","n":"kickoff_utc","r":false,"sh":"The match's scheduled kickoff (UTC).","t":"`$STRING`","key$":"kickoff_utc","index$":17},"label":{"a":true,"h":"Label","n":"label","r":false,"t":"`$STRING`","key$":"label","index$":18},"last":{"a":true,"h":"Last","n":"last","r":true,"sh":"One recorded price.","t":"`$OBJECT`","key$":"last","index$":19},"last_seen":{"a":true,"fo":"date-time","h":"Last Seen","n":"last_seen","r":false,"t":"`$STRING`","key$":"last_seen","index$":20},"league":{"a":true,"h":"League","n":"league","r":false,"t":"`$STRING`","key$":"league","index$":21},"line":{"a":true,"h":"Line","n":"line","r":false,"sh":"The market line where applicable (e.g.","t":"`$STRING`","key$":"line","index$":22},"links":{"a":true,"h":"Links","n":"links","r":false,"sh":"Ready-made bet365 deep links.","t":"`$OBJECT`","key$":"links","index$":23},"market_count":{"a":true,"h":"Market Count","n":"market_count","r":true,"sh":"Markets priced for this match (unaffected by the groups filter).","t":"`$INTEGER`","key$":"market_count","index$":24},"market_id":{"a":true,"h":"Market Id","n":"market_id","r":false,"t":"`$STRING`","key$":"market_id","index$":25},"markets":{"a":true,"h":"Markets","n":"markets","r":true,"t":"`$ARRAY`","key$":"markets","index$":26},"n2":{"a":true,"h":"N2","n":"n2","r":false,"sh":"Second participant where the market names one; same field as /odds.","t":"`$STRING`","key$":"n2","index$":27},"note":{"a":true,"h":"Note","n":"note","r":false,"sh":"A short qualifier when the score alone is not enough, for example a tied ice-hockey final whose shoot-out or overtime winning goal is not part of bet365's score feed, or a cricket result by innings (bet365 lists innings in batting order,…","t":"`$STRING`","key$":"note","index$":28},"odds_dec":{"a":true,"h":"Odds Dec","n":"odds_dec","r":true,"t":"`$NUMBER`","key$":"odds_dec","index$":29},"odds_frac":{"a":true,"h":"Odds Frac","n":"odds_frac","r":false,"sh":"Derived display fraction; odds_dec is authoritative.","t":"`$STRING`","key$":"odds_frac","index$":30},"overtime":{"a":true,"h":"Overtime","n":"overtime","r":false,"sh":"Present and true when the match was decided beyond regulation: the final period seen was overtime or a shoot-out, or (for ice hockey) the final score is level so an overtime or shoot-out settled it.","t":"`$BOOLEAN`","key$":"overtime","index$":31},"periods":{"a":true,"h":"Periods","n":"periods","r":false,"sh":"Per-period / per-set scores where the sport exposes them.","t":"`$ARRAY`","key$":"periods","index$":32},"polled_at":{"a":true,"fo":"date-time","h":"Polled At","n":"polled_at","r":false,"sh":"When this match was last refreshed.","t":"`$STRING`","key$":"polled_at","index$":33},"pre_close":{"a":true,"h":"Pre Close","n":"pre_close","r":true,"sh":"One recorded price.","t":"`$OBJECT`","key$":"pre_close","index$":34},"quotes":{"a":true,"h":"Quotes","n":"quotes","op":{"list":{"req":true,"type":"`$ARRAY`"}},"r":false,"t":["`$ONE`",["`$ARRAY`","`$NULL`"]],"key$":"quotes","index$":35},"region":{"a":true,"h":"Region","n":"region","r":false,"t":"`$STRING`","key$":"region","index$":36},"score":{"a":true,"h":"Score","n":"score","r":false,"sh":"Live scoreline while in play, home-away.","t":"`$STRING`","key$":"score","index$":37},"sel_id":{"a":true,"h":"Sel Id","n":"sel_id","op":{"list":{"req":false,"type":"`$STRING`"}},"r":true,"t":"`$STRING`","key$":"sel_id","index$":38},"server_time":{"a":true,"fo":"date-time","h":"Server Time","n":"server_time","r":true,"t":"`$STRING`","key$":"server_time","index$":39},"side":{"a":true,"h":"Side","n":"side","r":false,"sh":"Selection side where the market uses one (e.g.","t":"`$STRING`","key$":"side","index$":40},"sport":{"a":true,"h":"Sport","n":"sport","op":{"list":{"req":true,"type":"`$STRING`"}},"r":false,"t":"`$STRING`","key$":"sport","index$":41},"status":{"a":true,"h":"Status","n":"status","r":false,"sh":"finished: the match reached full time (a player or side won the required sets, baseball reached the 9th inning, or a cricket run result was derived).","t":"`$STRING`","key$":"status","index$":42},"suspended":{"a":true,"h":"Suspended","n":"suspended","r":true,"t":"`$BOOLEAN`","key$":"suspended","index$":43},"ts":{"a":true,"fo":"date-time","h":"Ts","n":"ts","r":true,"t":"`$STRING`","key$":"ts","index$":44},"updated_at":{"a":true,"fo":"date-time","h":"Updated At","n":"updated_at","r":false,"t":"`$STRING`","key$":"updated_at","index$":45}},"id":{"field":"id","name":"id"},"name":"odd","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /closing","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"203238114","k":"query","n":"fi","or":"fi","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/closing","q":{"exist":["fi"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"closing"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0},{"a":true,"co":{"id":"GET /history","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"203238114","k":"query","n":"fi","or":"fi","r":true,"t":"`$STRING`","index$":0},{"a":true,"k":"query","n":"from","or":"from","r":false,"t":"`$STRING`","index$":1},{"a":true,"k":"query","n":"group","or":"group","r":false,"t":"`$STRING`","index$":2},{"a":true,"ex":5000,"k":"query","n":"limit","or":"limit","r":false,"t":"`$INTEGER`","index$":3},{"a":true,"k":"query","n":"sel","or":"sel","r":false,"t":"`$STRING`","index$":4},{"a":true,"k":"query","n":"to","or":"to","r":false,"t":"`$STRING`","index$":5}]},"k":"http","m":"GET","o":"/history","q":{"exist":["fi"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"history"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":1},{"a":true,"co":{"id":"GET /results","source":"openapi3","version":2},"g":{"query":[{"a":true,"k":"query","n":"date","or":"date","r":false,"t":"`$STRING`","index$":0},{"a":true,"k":"query","n":"fi","or":"fi","r":false,"t":"`$STRING`","index$":1},{"a":true,"ex":"soccer","k":"query","n":"sport","or":"sport","r":true,"t":"`$STRING`","index$":2}]},"k":"http","m":"GET","o":"/results","q":{"exist":["sport"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"results"}],"t":{"req":"`reqdata`","res":"`body.results`"},"index$":2},{"a":true,"co":{"id":"GET /catalog","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"soccer","k":"query","n":"sport","or":"sport","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/catalog","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"catalog"}],"t":{"req":"`reqdata`","res":"`body.fixtures`"},"index$":3},{"a":true,"co":{"id":"GET /odds","source":"openapi3","version":2},"g":{"query":[{"a":true,"k":"query","n":"group","or":"groups","r":false,"t":"`$STRING`","index$":0},{"a":true,"k":"query","n":"in_play","or":"in_play","r":false,"t":"`$STRING`","index$":1},{"a":true,"k":"query","n":"link","or":"links","r":false,"t":"`$STRING`","index$":2},{"a":true,"ex":"soccer","k":"query","n":"sport","or":"sport","r":false,"t":"`$STRING`","index$":3}]},"k":"http","m":"GET","o":"/odds","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"odds"}],"t":{"req":"`reqdata`","res":"`body.matches`"},"index$":4},{"a":true,"co":{"id":"GET /outrights","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"all","k":"query","n":"sport","or":"sport","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/outrights","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"outrights"}],"t":{"req":"`reqdata`","res":"`body.events`"},"index$":5}],"key$":"list"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /snapshot","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"203363787","k":"query","n":"fi","or":"fi","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/snapshot","q":{"exist":["fi"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"snapshot"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"odd","name__orig":"odd","Name":"Odd","name_":"odd","name-":"odd","NAME":"ODD","index$":1}, {"active":true,"entity":"odd","key$":"BasicOddFlow","kind":"basic","name":"BasicOddFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"odd_ref01"}}],"index$":0},{"a":true,"d":{},"i":{"ref":"odd_ref01","srcdatavar":"odd_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-odd_ref01"}}],"index$":1}]}, 'Odd', {"GET /closing":{"protocol":"http","parameters":[{"name":"fi","in":"query","required":true,"description":"The match (fixture) id.","schema":{"type":"string"},"example":"203238114","index$":0}]},"GET /history":{"protocol":"http","parameters":[{"name":"fi","in":"query","required":true,"description":"The match (fixture) id.","schema":{"type":"string"},"example":"203238114","index$":0},{"name":"group","in":"query","description":"Only quotes in this market-group id.","schema":{"type":"string"},"index$":1},{"name":"sel","in":"query","description":"Only this selection id.","schema":{"type":"string"},"index$":2},{"name":"from","in":"query","description":"Window start: RFC3339 (e.g. 2026-10-04T12:00:00Z) or Unix seconds.","schema":{"type":"string"},"index$":3},{"name":"to","in":"query","description":"Window end: RFC3339 or Unix seconds.","schema":{"type":"string"},"index$":4},{"name":"limit","in":"query","description":"Max rows (default 5000, max 50000).","schema":{"type":"integer","default":5000,"maximum":50000},"index$":5}]},"GET /results":{"protocol":"http","parameters":[{"name":"sport","in":"query","required":true,"description":"Which sport's finished matches to return (e.g. soccer, tennis, basketball, ice_hockey, american_football, volleyball).","schema":{"type":"string"},"example":"soccer","index$":0},{"name":"date","in":"query","required":false,"description":"Restrict to matches that finished on this UTC calendar day (YYYY-MM-DD).","schema":{"type":"string","format":"date"},"index$":1},{"name":"fi","in":"query","required":false,"description":"Restrict to a single bet365 fixture id.","schema":{"type":"string"},"index$":2}]},"GET /catalog":{"protocol":"http","parameters":[{"name":"sport","in":"query","description":"Which sport to return. Default soccer; all = every sport. Every match carries its own sport field.","schema":{"type":"string","enum":["soccer","tennis","basketball","american_football","ice_hockey","baseball","rugby_union","rugby_league","cricket","australian_rules","table_tennis","volleyball","handball","badminton","esports","darts","snooker","boxing","mma","futsal","bandy","floorball","field_hockey","gaelic_sports","all"],"default":"soccer"},"index$":0}]},"GET /odds":{"protocol":"http","parameters":[{"name":"sport","in":"query","description":"Which sport to return. Default soccer; all = every sport. Every match carries its own sport field.","schema":{"type":"string","enum":["soccer","tennis","basketball","american_football","ice_hockey","baseball","rugby_union","rugby_league","cricket","australian_rules","table_tennis","volleyball","handball","badminton","esports","darts","snooker","boxing","mma","futsal","bandy","floorball","field_hockey","gaelic_sports","all"],"default":"soccer"},"index$":0},{"name":"in_play","in":"query","description":"1 = only matches currently in play.","schema":{"type":"string","enum":["1","true"]},"index$":1},{"name":"groups","in":"query","description":"Comma-separated market group ids; only quotes in these groups are returned. Soccer Full Time Result is 40 before kickoff and 1777 in play; tennis To Win Match is 83 before the match and To Win (67, line \"Match\") in play. See https://moviodds.com/docs/markets/. Other sports: the match winner is the selection with line \"To Win\" in the \"Game\" market (side = the team); its group id can differ between pre-match and in-play.","schema":{"type":"string","examples":["40,1777"]},"index$":2},{"name":"links","in":"query","description":"1 = add a ready-made bet365 deep-link object to every match (the links property). Opt-in so the default board is unchanged. See the MatchLinks schema; the host is server-configured (default www.bet365.com) and works on any regional domain.","schema":{"type":"string","enum":["1","true"]},"index$":3}]},"GET /outrights":{"protocol":"http","parameters":[{"name":"sport","in":"query","description":"Which sport's futures to return. all (or omitted) returns every sport that has futures. An unknown key is a 400.","schema":{"type":"string","enum":["formula1","golf","cycling","american_football","basketball","ice_hockey","baseball","rugby_union","rugby_league","australian_rules","soccer","all"],"default":"all"},"index$":0}]},"GET /snapshot":{"protocol":"http","parameters":[{"name":"fi","in":"query","required":true,"description":"Match id from /catalog or /odds.","schema":{"type":"string","pattern":"^[0-9]+$"},"example":"203363787","index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let odd_ref01_data = Object.values(setup.data.existing.odd)[0] as any

    // LIST
    const odd_ref01_ent = client.Odd()
    const odd_ref01_match: any = {}

    const odd_ref01_list = (await odd_ref01_ent.list(odd_ref01_match)).map((e: any) => e.data())


    // LOAD
    const odd_ref01_match_dt0: any = {}
    odd_ref01_match_dt0.id = odd_ref01_data.id
    const odd_ref01_data_dt0 = (await odd_ref01_ent.load(odd_ref01_match_dt0)).data()
    assert(odd_ref01_data_dt0.id === odd_ref01_data.id)


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/odd/OddTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = MovioddsOddsSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['odd01','odd02','odd03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'MOVIODDS_ODDS_TEST_ODD_ENTID': idmap,
    'MOVIODDS_ODDS_TEST_LIVE': 'FALSE',
    'MOVIODDS_ODDS_TEST_EXPLAIN': 'FALSE',
    'MOVIODDS_ODDS_APIKEY': '',
  })

  idmap = env['MOVIODDS_ODDS_TEST_ODD_ENTID']

  const live = 'TRUE' === env.MOVIODDS_ODDS_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['MOVIODDS_ODDS_TEST_ODD_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new MovioddsOddsSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
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
    ]))
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
  }

  return setup
}
  
