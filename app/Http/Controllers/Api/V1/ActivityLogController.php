<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Tampilkan daftar log aktivitas user yang sedang login.
     * Mendukung filter action dan pagination.
     */
    public function index(Request $request)
    {
        $user = auth('api')->user();

        $query = ActivityLog::where('user_id', $user->id)
            ->with('user:id,name,avatar,role')
            ->latest();

        // Filter opsional berdasarkan jenis aksi
        if ($request->has('action') && $request->action !== 'all') {
            $query->where('action', $request->action);
        }

        // Filter opsional berdasarkan rentang tanggal
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->paginate(25);

        // Tambah label & icon ke tiap log
        $logs->getCollection()->transform(function ($log) {
            $log->action_label = ActivityLog::actionLabel($log->action);
            $log->action_icon  = ActivityLog::actionIcon($log->action);
            return $log;
        });

        return response()->json($logs);
    }

    /**
     * Catat log aktivitas dari frontend.
     * Dipanggil oleh komponen React saat user melakukan aksi tertentu.
     */
    public function store(Request $request)
    {
        $user = auth('api')->user();

        $validated = $request->validate([
            'action'       => 'required|string|max:100',
            'subject_type' => 'nullable|string|max:100',
            'subject_id'   => 'nullable|string|max:36',
            'subject_name' => 'nullable|string|max:255',
            'metadata'     => 'nullable|array',
        ]);

        $log = ActivityLog::record(
            userId:      $user->id,
            action:      $validated['action'],
            subjectType: $validated['subject_type'] ?? null,
            subjectId:   $validated['subject_id'] ?? null,
            subjectName: $validated['subject_name'] ?? null,
            metadata:    $validated['metadata'] ?? null,
            ipAddress:   $request->ip(),
        );

        $log->action_label = ActivityLog::actionLabel($log->action);
        $log->action_icon  = ActivityLog::actionIcon($log->action);

        return response()->json($log, 201);
    }
}
