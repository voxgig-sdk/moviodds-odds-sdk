# Status entity test

require "minitest/autorun"
require "json"
require_relative "../MovioddsOdds_sdk"
require_relative "runner"

class StatusEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = MovioddsOddsSDK.test(nil, nil)
    ent = testsdk.Status(nil)
    assert !ent.nil?
  end

  def test_validate
    cfg = MovioddsOddsConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = MovioddsOddsSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.Status(nil).load({ "cache_fixtures" => "x" }, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_basic_flow
    setup = status_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["load"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "status." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    client = setup[:client]

    # Bootstrap entity data from existing test data.
    status_ref01_data_raw = Vs.items(Helpers.to_map(
      Vs.getpath(setup[:data], "existing.status")))
    status_ref01_data = nil
    if status_ref01_data_raw.length > 0
      status_ref01_data = Helpers.to_map(status_ref01_data_raw[0][1])
    end

    # LOAD
    status_ref01_ent = client.Status(nil)
    status_ref01_match_dt0 = {}
    status_ref01_data_dt0_loaded = status_ref01_ent.load(status_ref01_match_dt0, nil)
    assert !status_ref01_data_dt0_loaded.nil?

  end
end

def status_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "status", "StatusTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = MovioddsOddsSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["status01", "status02", "status03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["MOVIODDS_ODDS_TEST_STATUS_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "MOVIODDS_ODDS_TEST_STATUS_ENTID" => idmap,
    "MOVIODDS_ODDS_TEST_LIVE" => "FALSE",
    "MOVIODDS_ODDS_TEST_EXPLAIN" => "FALSE",
    "MOVIODDS_ODDS_APIKEY" => "",
  })

  idmap_resolved = Helpers.to_map(
    env["MOVIODDS_ODDS_TEST_STATUS_ENTID"])
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
