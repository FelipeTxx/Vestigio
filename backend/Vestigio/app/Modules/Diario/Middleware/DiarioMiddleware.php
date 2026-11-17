<?php

namespace App\Modules\Diario\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DiarioMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }
}