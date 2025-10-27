<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\MailFormRequest;
use Inertia\Inertia;
use Inertia\Response;
use App\Mail\MailForm;
use Illuminate\Support\Facades\Mail;


class MailController extends Controller
{

    public function index()
    {
        return Inertia::render('mail');
    }

    public function send_email(MailFormRequest $request)
    {
        try {
            Mail::to('inside-dev360@yandex.ru')->send(new MailForm($request->validated()));
            return redirect()->route('mail')->with('success', 'Письмо успешно отправлено на email');
        } catch (\Exception $e) {
            return redirect()->route('mail')->with('error', 'Ошибка отправки письма: ' . $e->getMessage());
        }
    }
}
