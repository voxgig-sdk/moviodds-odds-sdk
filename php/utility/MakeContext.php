<?php
declare(strict_types=1);

// MovioddsOdds SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class MovioddsOddsMakeContext
{
    public static function call(array $ctxmap, ?MovioddsOddsContext $basectx): MovioddsOddsContext
    {
        return new MovioddsOddsContext($ctxmap, $basectx);
    }
}
