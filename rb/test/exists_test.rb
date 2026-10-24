# MovioddsOdds SDK exists test

require "minitest/autorun"
require_relative "../MovioddsOdds_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = MovioddsOddsSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
