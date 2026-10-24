# MovioddsOdds SDK utility: prepare_body
require_relative 'media'
module MovioddsOddsUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return MovioddsOddsUtilities.raw_body(ctx.reqdata) if MovioddsOddsUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
