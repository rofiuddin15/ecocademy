<?php

use Illuminate\Support\Facades\Route;

// All web routes (including the root landing page '/') are served by the React SPA shell
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
