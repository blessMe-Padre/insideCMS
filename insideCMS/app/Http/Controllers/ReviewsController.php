<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Review;

class ReviewsController extends Controller
{

    public function show(Request $request): Response
    {
        return Inertia::render('reviews', [
            'reviews' => Review::where('is_published', true)->get(),
        ]);
    }

    public function adminShow(Request $request): Response
    {
        return Inertia::render('reviews-admin', [
            'reviews' => Review::all(),
        ]);
    }

    /**
     * Store a new review.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'author_name' => 'required|string|max:255',
            'content' => 'required|string|max:2000',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        Review::create([
            ...$validated,
            'is_published' => true, // По умолчанию отзыв опубликован
        ]);

        return redirect()->route('reviews')->with('success', 'Отзыв успешно отправлен и будет рассмотрен администратором.');
    }
}
