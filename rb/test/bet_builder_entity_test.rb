# BetBuilder entity test

require "minitest/autorun"
require "json"
require_relative "../MovioddsOdds_sdk"
require_relative "runner"

class BetBuilderEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = MovioddsOddsSDK.test(nil, nil)
    ent = testsdk.BetBuilder(nil)
    assert !ent.nil?
  end

  def test_basic_flow
    setup = bet_builder_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "bet_builder." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    client = setup[:client]

    # CREATE
    bet_builder_ref01_ent = client.BetBuilder(nil)
    bet_builder_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.bet_builder"), "bet_builder_ref01"))

    bet_builder_ref01_data_result = bet_builder_ref01_ent.create(bet_builder_ref01_data, nil)
    bet_builder_ref01_data = Helpers.to_map(bet_builder_ref01_data_result.respond_to?(:data_get) ? bet_builder_ref01_data_result.data_get : bet_builder_ref01_data_result)
    assert !bet_builder_ref01_data.nil?

  end
end

def bet_builder_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "bet_builder", "BetBuilderTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = MovioddsOddsSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["bet_builder01", "bet_builder02", "bet_builder03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["MOVIODDS_ODDS_TEST_BET_BUILDER_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "MOVIODDS_ODDS_TEST_BET_BUILDER_ENTID" => idmap,
    "MOVIODDS_ODDS_TEST_LIVE" => "FALSE",
    "MOVIODDS_ODDS_TEST_EXPLAIN" => "FALSE",
    "MOVIODDS_ODDS_APIKEY" => "",
  })

  idmap_resolved = Helpers.to_map(
    env["MOVIODDS_ODDS_TEST_BET_BUILDER_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["MOVIODDS_ODDS_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
      {
        "apikey" => env["MOVIODDS_ODDS_APIKEY"],
      },
      extra || {},
    ])
    client = MovioddsOddsSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["MOVIODDS_ODDS_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["MOVIODDS_ODDS_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
