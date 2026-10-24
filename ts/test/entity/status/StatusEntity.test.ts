

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


describe('StatusEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when MOVIODDS_ODDS_TEST_LIVE=TRUE.
  afterEach(liveDelay('MOVIODDS_ODDS_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = MovioddsOddsSDK.test()
    const ent = testsdk.Status()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = MovioddsOddsSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Status().load({"cache_fixtures":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.MOVIODDS_ODDS_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'status.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"cache_fixtures":{"a":true,"h":"Cache Fixtures","n":"cache_fixtures","r":false,"t":"`$INTEGER`","key$":"cache_fixtures","index$":0},"cache_quotes":{"a":true,"h":"Cache Quotes","n":"cache_quotes","r":false,"t":"`$INTEGER`","key$":"cache_quotes","index$":1},"catalog_fixtures":{"a":true,"h":"Catalog Fixtures","n":"catalog_fixtures","r":false,"t":"`$INTEGER`","key$":"catalog_fixtures","index$":2},"last_change_unix":{"a":true,"h":"Last Change Unix","n":"last_change_unix","r":false,"t":"`$INTEGER`","key$":"last_change_unix","index$":3},"last_fixture_seen_by_sport":{"a":true,"h":"Last Fixture Seen By Sport","n":"last_fixture_seen_by_sport","r":false,"sh":"Per sport, the most recent time a fixture for that sport was seen in a catalog sweep.","t":"`$OBJECT`","key$":"last_fixture_seen_by_sport","index$":4},"status":{"a":true,"h":"Status","n":"status","r":false,"t":"`$STRING`","key$":"status","index$":5},"warming":{"a":true,"h":"Warming","n":"warming","r":false,"sh":"True right after a restart while the board loads.","t":"`$BOOLEAN`","key$":"warming","index$":6}},"name":"status","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /health","source":"openapi3","version":2},"g":{},"k":"http","m":"GET","o":"/health","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"health"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"status","name__orig":"status","Name":"Status","name_":"status","name-":"status","NAME":"STATUS","index$":2}, {"active":true,"entity":"status","key$":"BasicStatusFlow","kind":"basic","name":"BasicStatusFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"status_ref01","srcdatavar":"status_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-status_ref01"}}],"index$":0}]}, 'Status', {"GET /health":{"protocol":"http","parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let status_ref01_data = Object.values(setup.data.existing.status)[0] as any

    // LOAD
    const status_ref01_ent = client.Status()
    const status_ref01_match_dt0: any = {}
    const status_ref01_data_dt0 = (await status_ref01_ent.load(status_ref01_match_dt0)).data()
    assert(null != status_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/status/StatusTestData.json')

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
    ['status01','status02','status03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'MOVIODDS_ODDS_TEST_STATUS_ENTID': idmap,
    'MOVIODDS_ODDS_TEST_LIVE': 'FALSE',
    'MOVIODDS_ODDS_TEST_EXPLAIN': 'FALSE',
    'MOVIODDS_ODDS_APIKEY': '',
  })

  idmap = env['MOVIODDS_ODDS_TEST_STATUS_ENTID']

  const live = 'TRUE' === env.MOVIODDS_ODDS_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['MOVIODDS_ODDS_TEST_STATUS_ENTID']
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
  
