-- MovioddsOdds SDK exists test

local sdk = require("moviodds-odds_sdk")

describe("MovioddsOddsSDK", function()
  it("should create test SDK", function()
    local testsdk = sdk.test(nil, nil)
    assert.is_not_nil(testsdk)
  end)
end)
