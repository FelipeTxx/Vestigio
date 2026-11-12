<?php

namespace App\Jobs;

use App\Modules\User\UserService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;


class StoreUserJob implements ShouldQueue
{
    use Queueable;
    public int $tries = 5;
    public array $backoff = [5, 15, 30, 60];    

    /**
     * Create a new job instance.
     */
    public function __construct(public array $dados)
    {
        
    }

    /**
     * Execute the job.
     */
    public function handle(UserService $service): void
    {
        $service->criar($this->dados);
    }
}
