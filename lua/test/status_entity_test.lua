-- Status entity test

local json = require("dkjson")
local vs = require("utility.struct.struct")
local sdk = require("moviodds-odds_sdk")
local helpers = require("core.helpers")
local runner = require("test.runner")

local _test_dir = debug.getinfo(1, "S").source:match("^@(.+/)")  or "./"

-- main.kit.test.live.strict is true (the default is true): a live
-- request that fails, or a live test missing an input it needs,
-- fails the test.
-- An account with no record for a test to read skips it either way.
local LIVE_STRICT = true


describe("StatusEntity", function()
  it("should create instance", function()
    local testsdk = sdk.test(nil, nil)
    local ent = testsdk:Status(nil)
    assert.is_not_nil(ent)
  end)

  it("should refuse an invalid request", function()
    local config = require("config_shared")()
    if type(config.feature) ~= "table" or config.feature.validate == nil then
      pending("feature not present in this SDK: validate")
      return
    end
    local client = sdk.test(nil, { feature = { validate = { active = true } } })
    local _, err = client:Status(nil):load({ ["cache_fixtures"] = "x" }, nil)
    assert.are.equal("validate_failed", type(err) == "table" and err.code or nil)
  end)

  it("should run basic flow", function()
    local setup = status_basic_setup(nil)
    -- Per-op sdk-test-control.json skip.
    local _live = setup.live or false
    for _, _op in ipairs({"load"}) do
      local _should_skip, _reason = runner.is_control_skipped("entityOp", "status." .. _op, _live and "live" or "unit")
      if _should_skip then
        pending(_reason or "skipped via sdk-test-control.json")
        return
      end
    end
    local client = setup.client

    -- Bootstrap entity data from existing test data.
    local status_ref01_data_raw = vs.items(helpers.to_map(
      vs.getpath(setup.data, "existing.status")))
    local status_ref01_data = nil
    if #status_ref01_data_raw > 0 then
      status_ref01_data = helpers.to_map(status_ref01_data_raw[1][2])
    end

    -- LOAD
    local status_ref01_ent = client:Status(nil)
    local status_ref01_match_dt0 = {}
    local status_ref01_data_dt0_loaded, err = status_ref01_ent:load(status_ref01_match_dt0, nil)
    assert.is_nil(err)
    assert.is_not_nil(status_ref01_data_dt0_loaded)

  end)
end)

function status_basic_setup(extra)
  runner.load_env_local()

  local entity_data_file = _test_dir .. "../../.sdk/test/entity/status/StatusTestData.json"
  local f = io.open(entity_data_file, "r")
  if f == nil then
    error("failed to read status test data: " .. entity_data_file)
  end
  local entity_data_source = f:read("*a")
  f:close()

  local entity_data = json.decode(entity_data_source)

  local options = {}
  options["entity"] = entity_data["existing"]

  local client = sdk.test(options, extra)

  -- Generate idmap via transform.
  local idmap = vs.transform(
    { "status01", "status02", "status03" },
    {
      ["`$PACK`"] = { "", {
        ["`$KEY`"] = "`$COPY`",
        ["`$VAL`"] = { "`$FORMAT`", "upper", "`$COPY`" },
      }},
    }
  )

  -- Whether *_ENTID supplied the idmap, read before env_override consumes
  -- it: without it, the ids a live flow binds are the fixture's synthetic ones.
  local entid_env_raw = os.getenv("MOVIODDS_ODDS_TEST_STATUS_ENTID")
  local idmap_overridden = entid_env_raw ~= nil and entid_env_raw:match("^%s*{") ~= nil

  local env = runner.env_override({
    ["MOVIODDS_ODDS_TEST_STATUS_ENTID"] = idmap,
    ["MOVIODDS_ODDS_TEST_LIVE"] = "FALSE",
    ["MOVIODDS_ODDS_TEST_EXPLAIN"] = "FALSE",
    ["MOVIODDS_ODDS_APIKEY"] = "",
  })

  local idmap_resolved = helpers.to_map(
    env["MOVIODDS_ODDS_TEST_STATUS_ENTID"])
  if idmap_resolved == nil then
    idmap_resolved = helpers.to_map(idmap)
  end

  if env["MOVIODDS_ODDS_TEST_LIVE"] == "TRUE" then
    local merged_opts = vs.merge({
      -- FIRST, so the generated fields below win: sdk-test-control.json's
      -- test.client.options adds to the live client, it does not redirect it.
      runner.live_client_options(),
      {
        apikey = env["MOVIODDS_ODDS_APIKEY"],
      },
      extra or {},
    })
    client = sdk.new(helpers.to_map(merged_opts))
  end

  local live = env["MOVIODDS_ODDS_TEST_LIVE"] == "TRUE"
  return {
    client = client,
    data = entity_data,
    idmap = idmap_resolved,
    env = env,
    explain = env["MOVIODDS_ODDS_TEST_EXPLAIN"] == "TRUE",
    live = live,
    synthetic_only = live and not idmap_overridden,
    now = os.time() * 1000,
  }
end
