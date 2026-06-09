<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    /**
     * Display a listing of partners.
     */
    public function index()
    {
        $partners = Partner::withCount(['projects', 'courses'])->get();
        return response()->json($partners);
    }

    /**
     * Display the specified partner.
     */
    public function show($id)
    {
        $partner = Partner::with(['courses', 'projects.student', 'projects.course'])->findOrFail($id);
        return response()->json($partner);
    }
}
