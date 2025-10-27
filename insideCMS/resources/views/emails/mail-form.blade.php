<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Обратная связь</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
        h2 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .field {
            margin-bottom: 15px;
        }
        .field-label {
            font-weight: bold;
            color: #555;
        }
        .field-value {
            margin-top: 5px;
            padding: 8px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Новое обращение с сайта</h2>
        
        <div class="field">
            <div class="field-label">Имя:</div>
            <div class="field-value">{{ $data['name'] ?? 'Не указано' }}</div>
        </div>

        <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">{{ $data['email'] ?? 'Не указано' }}</div>
        </div>

        <div class="field">
            <div class="field-label">Телефон:</div>
            <div class="field-value">{{ $data['phone'] ?? 'Не указано' }}</div>
        </div>

        <div class="field">
            <div class="field-label">Тема:</div>
            <div class="field-value">{{ $data['subject'] ?? 'Не указано' }}</div>
        </div>

        <div class="field">
            <div class="field-label">Сообщение:</div>
            <div class="field-value">{{ $data['message'] ?? 'Не указано' }}</div>
        </div>
    </div>
</body>
</html>
