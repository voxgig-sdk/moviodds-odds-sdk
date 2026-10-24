# MovioddsOdds SDK utility: make_context
require_relative '../core/context'
module MovioddsOddsUtilities
  MakeContext = ->(ctxmap, basectx) {
    MovioddsOddsContext.new(ctxmap, basectx)
  }
end
