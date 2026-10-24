# MovioddsOdds SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'graphql'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

MovioddsOddsUtility.registrar = ->(u) {
  u.clean = MovioddsOddsUtilities::Clean
  u.clean_add = MovioddsOddsUtilities::CleanAdd
  u.clean_explain = MovioddsOddsUtilities::CleanExplain
  u.done = MovioddsOddsUtilities::Done
  u.make_error = MovioddsOddsUtilities::MakeError
  u.feature_add = MovioddsOddsUtilities::FeatureAdd
  u.feature_hook = MovioddsOddsUtilities::FeatureHook
  u.feature_init = MovioddsOddsUtilities::FeatureInit
  u.fetcher = MovioddsOddsUtilities::Fetcher
  u.make_fetch_def = MovioddsOddsUtilities::MakeFetchDef
  u.make_context = MovioddsOddsUtilities::MakeContext
  u.make_options = MovioddsOddsUtilities::MakeOptions
  u.make_request = MovioddsOddsUtilities::MakeRequest
  u.make_response = MovioddsOddsUtilities::MakeResponse
  u.make_result = MovioddsOddsUtilities::MakeResult
  u.make_point = MovioddsOddsUtilities::MakePoint
  u.make_spec = MovioddsOddsUtilities::MakeSpec
  u.make_url = MovioddsOddsUtilities::MakeUrl
  u.param = MovioddsOddsUtilities::Param
  u.prepare_auth = MovioddsOddsUtilities::PrepareAuth
  u.prepare_body = MovioddsOddsUtilities::PrepareBody
  u.prepare_headers = MovioddsOddsUtilities::PrepareHeaders
  u.prepare_method = MovioddsOddsUtilities::PrepareMethod
  u.prepare_params = MovioddsOddsUtilities::PrepareParams
  u.prepare_path = MovioddsOddsUtilities::PreparePath
  u.prepare_query = MovioddsOddsUtilities::PrepareQuery
  u.graphql_body = MovioddsOddsUtilities::GraphqlBody
  u.graphql_errors = MovioddsOddsUtilities::GraphqlErrors
  u.result_basic = MovioddsOddsUtilities::ResultBasic
  u.result_body = MovioddsOddsUtilities::ResultBody
  u.result_headers = MovioddsOddsUtilities::ResultHeaders
  u.transform_request = MovioddsOddsUtilities::TransformRequest
  u.transform_response = MovioddsOddsUtilities::TransformResponse
}
