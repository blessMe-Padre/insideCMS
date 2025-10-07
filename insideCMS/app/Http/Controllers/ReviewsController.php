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
        return Inertia::render('admin/reviews-admin', [
            'reviews' => Review::all(),
        ]);
    }

    /**
     * Создание нового отзыва
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
            'is_published' => false, // По умолчанию отзыв не опубликован
        ]);

        return redirect()->route('reviews')->with('success', 'Отзыв успешно отправлен и будет рассмотрен администратором.');
    }

    public function publish(Request $request, Review $review)
    {
        $review->update(['is_published' => true]);
        return redirect()->back()->with('success', 'Отзыв опубликован.');
    }

    public function unpublish(Request $request, Review $review)
    {
        $review->update(['is_published' => false]);
        return redirect()->back()->with('success', 'Отзыв снят с публикации.');
    }

    public function destroy(Request $request, Review $review)
    {
        $review->delete();
        return redirect()->back()->with('success', 'Отзыв удален.');
    }
}
