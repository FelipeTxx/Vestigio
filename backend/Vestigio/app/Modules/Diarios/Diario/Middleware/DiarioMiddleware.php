<?php

namespace App\Modules\Diarios\Diario\Middleware;

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