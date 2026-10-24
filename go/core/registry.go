package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewBetBuilderEntityFunc func(client *MovioddsOddsSDK, entopts map[string]any) MovioddsOddsEntity

var NewOddEntityFunc func(client *MovioddsOddsSDK, entopts map[string]any) MovioddsOddsEntity

var NewStatusEntityFunc func(client *MovioddsOddsSDK, entopts map[string]any) MovioddsOddsEntity

