<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Task::where('user_id', Auth::id());

        // Filter by status
        if ($request->has('status') && $request->status != 'All') {
            $query->where('status', $request->status);
        }

        // Sort by deadline
        if ($request->has('sort_by') && $request->sort_by == 'deadline') {
            $query->orderBy('deadline', $request->order ?? 'asc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return response()->json($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:To Do,In Progress,Done',
            'deadline' => 'nullable|date',
        ], [
            'title.required' => 'Judul tugas wajib diisi.',
            'title.max' => 'Judul tugas maksimal 255 karakter.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status tidak valid.',
            'deadline.date' => 'Format tanggal batas waktu tidak valid.',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $task = Task::create(array_merge(
            $validator->validated(),
            [
                'user_id' => Auth::id(),
                'created_by' => Auth::user()->name
            ]
        ));

        return response()->json($task, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $task = Task::where('user_id', Auth::id())->where('task_id', $id)->first();

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json($task);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $task = Task::where('user_id', Auth::id())->where('task_id', $id)->first();

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:To Do,In Progress,Done',
            'deadline' => 'nullable|date',
        ], [
            'title.max' => 'Judul tugas maksimal 255 karakter.',
            'status.in' => 'Status tidak valid.',
            'deadline.date' => 'Format tanggal batas waktu tidak valid.',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $task->update($validator->validated());

        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task = Task::where('user_id', Auth::id())->where('task_id', $id)->first();

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted']);
    }
}
