<?php

namespace App\Modules\UserConfig\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserConfigMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }
}