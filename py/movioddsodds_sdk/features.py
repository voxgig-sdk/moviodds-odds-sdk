# MovioddsOdds SDK feature factory

from movioddsodds_sdk.feature.base_feature import MovioddsOddsBaseFeature
from movioddsodds_sdk.feature.ratelimit_feature import MovioddsOddsRatelimitFeature
from movioddsodds_sdk.feature.retry_feature import MovioddsOddsRetryFeature
from movioddsodds_sdk.feature.test_feature import MovioddsOddsTestFeature
from movioddsodds_sdk.feature.timeout_feature import MovioddsOddsTimeoutFeature


_FEATURES = {
    "base": lambda: MovioddsOddsBaseFeature(),
    "ratelimit": lambda: MovioddsOddsRatelimitFeature(),
    "retry": lambda: MovioddsOddsRetryFeature(),
    "test": lambda: MovioddsOddsTestFeature(),
    "timeout": lambda: MovioddsOddsTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
