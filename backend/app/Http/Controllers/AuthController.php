<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request) {

    $auth = 'false';

     if(md5($request->password) == config('app.weather_password')){
        $auth = 'true';
     }

     return response()
     ->json($auth);
  }
}
