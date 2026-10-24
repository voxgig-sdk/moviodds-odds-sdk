# MovioddsOdds SDK utility: make_context

from projectname_sdk.core.context import MovioddsOddsContext


def make_context_util(ctxmap, basectx):
    return MovioddsOddsContext(ctxmap, basectx)
