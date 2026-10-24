# MovioddsOdds SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module MovioddsOddsFeatures
  def self.make_feature(name)
    case name
    when "base"
      MovioddsOddsBaseFeature.new
    when "ratelimit"
      MovioddsOddsRatelimitFeature.new
    when "retry"
      MovioddsOddsRetryFeature.new
    when "test"
      MovioddsOddsTestFeature.new
    when "timeout"
      MovioddsOddsTimeoutFeature.new
    else
      MovioddsOddsBaseFeature.new
    end
  end
end
