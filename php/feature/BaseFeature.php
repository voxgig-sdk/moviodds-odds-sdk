<?php
declare(strict_types=1);

// MovioddsOdds SDK base feature

class MovioddsOddsBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(MovioddsOddsContext $ctx, array $options): void {}
    public function PostConstruct(MovioddsOddsContext $ctx): void {}
    public function PostConstructEntity(MovioddsOddsContext $ctx): void {}
    public function SetData(MovioddsOddsContext $ctx): void {}
    public function GetData(MovioddsOddsContext $ctx): void {}
    public function GetMatch(MovioddsOddsContext $ctx): void {}
    public function SetMatch(MovioddsOddsContext $ctx): void {}
    public function PrePoint(MovioddsOddsContext $ctx): void {}
    public function PreSpec(MovioddsOddsContext $ctx): void {}
    public function PreRequest(MovioddsOddsContext $ctx): void {}
    public function PreResponse(MovioddsOddsContext $ctx): void {}
    public function PreResult(MovioddsOddsContext $ctx): void {}
    public function PreDone(MovioddsOddsContext $ctx): void {}
    public function PreUnexpected(MovioddsOddsContext $ctx): void {}
}
