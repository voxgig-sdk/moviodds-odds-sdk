

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


describe('BetBuilderEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when MOVIODDS_ODDS_TEST_LIVE=TRUE.
  afterEach(liveDelay('MOVIODDS_ODDS_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = MovioddsOddsSDK.test()
    const ent = testsdk.BetBuilder()
    assert(null != ent)
  })




  test('basic', async (t) => {

    const live = 'TRUE' === process.env.MOVIODDS_ODDS_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'bet_builder.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"results":{"a":true,"h":"Results","n":"results","r":true,"t":"`$ARRAY`","key$":"results","index$":0},"server_time":{"a":true,"fo":"date-time","h":"Server Time","n":"server_time","r":true,"t":"`$STRING`","key$":"server_time","index$":1},"slips":{"a":true,"h":"Slips","n":"slips","r":true,"t":"`$ARRAY`","key$":"slips","index$":2}},"name":"bet_builder","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["slips"],"co":{"id":"POST /betbuilder/price","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/betbuilder/price","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"betbuilder"},{"lit":"price"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"bet_builder","name__orig":"bet_builder","Name":"BetBuilder","name_":"bet_builder","name-":"bet-builder","NAME":"BET_BUILDER","index$":0}, {"active":true,"entity":"bet_builder","key$":"BasicBetBuilderFlow","kind":"basic","name":"BasicBetBuilderFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"bet_builder_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0}]}, 'BetBuilder', {"POST /betbuilder/price":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"slips":{"type":"array","minItems":1,"maxItems":50,"items":{"type":"object","properties":{"fixture":{"type":"string","pattern":"^[0-9]+$"},"legs":{"type":"array","minItems":2,"maxItems":12,"items":{},"description":"sel_id values."}},"required":["fixture","legs"]},"key$":"slips"}},"required":["slips"],"index$":1}}}},"parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const bet_builder_ref01_ent = client.BetBuilder()
    let bet_builder_ref01_data = setup.data.new.bet_builder['bet_builder_ref01']

    bet_builder_ref01_data = (await bet_builder_ref01_ent.create(bet_builder_ref01_data)).data()
    assert(null != bet_builder_ref01_data)


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
      '../../../../.sdk/test/entity/bet_builder/BetBuilderTestData.json')

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
    ['bet_builder01','bet_builder02','bet_builder03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'MOVIODDS_ODDS_TEST_BET_BUILDER_ENTID': idmap,
    'MOVIODDS_ODDS_TEST_LIVE': 'FALSE',
    'MOVIODDS_ODDS_TEST_EXPLAIN': 'FALSE',
    'MOVIODDS_ODDS_APIKEY': '',
  })

  idmap = env['MOVIODDS_ODDS_TEST_BET_BUILDER_ENTID']

  const live = 'TRUE' === env.MOVIODDS_ODDS_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['MOVIODDS_ODDS_TEST_BET_BUILDER_ENTID']
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
  
