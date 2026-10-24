<?php
declare(strict_types=1);

// MovioddsOdds SDK utility: result_headers

class MovioddsOddsResultHeaders
{
    public static function call(MovioddsOddsContext $ctx): ?MovioddsOddsResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
