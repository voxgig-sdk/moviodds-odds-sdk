# MovioddsOdds SDK exists test

import pytest
from movioddsodds_sdk import MovioddsOddsSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = MovioddsOddsSDK.test(None, None)
        assert testsdk is not None
