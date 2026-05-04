<?php

header('Content-Type: application/json');

/* -------------------
   Honeypot защита
------------------- */

if (!empty($_POST['qwerty123']) || !empty($_POST['123qwerty'])) {

    echo json_encode([
        "success" => false
    ]);

    exit;
}

/* -------------------
   Получаем данные
------------------- */

$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$email = $_POST['email'] ?? '';
$company = $_POST['company'] ?? '';
$role = $_POST['role'] ?? '';
$program = $_POST['program'] ?? '';

$date = date("d.m.Y H:i");

/* -------------------
   Сообщение
------------------- */

$message = "Новая заявка с сайта\n\n";

// Если пришёл только телефон (попап) — короткое письмо
if ($phone && !$name && !$email) {
    $message .= "Телефон: $phone\n";
    $message .= "Источник: всплывающий попап\n\n";
} else {
    $message .= "Имя: $name\n";
    $message .= "Телефон: $phone\n";
    $message .= "Email: $email\n";
    $message .= "Компания: $company\n";
    $message .= "Роль: $role\n";
    $message .= "Программа: $program\n\n";
}

$message .= "Дата: $date";

/* -------------------
   Email
------------------- */

$to = "crkteam@yandex.ru";   // сюда приходит заявка
$subject = "Новая заявка с сайта";

$headers = "From: site@crk.agency-innovation.com\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

$mail = mail($to, $subject, $message, $headers);

/* -------------------
   Ответ JS
------------------- */

if ($mail) {

    echo json_encode([
        "success" => true
    ]);

} else {

    echo json_encode([
        "success" => false
    ]);

}

/* -------------------
   Google Sheets
------------------- */

$sheetsUrl = "https://script.google.com/macros/s/AKfycby1MTAsyIcAbprdc4Ts6Mu8RW-D3EFvW2pmWDk5YQ4UCstogVkLYMTnju4-IKn8vQA8ew/exec"; // твой URL

$sheetsData = json_encode([
    "date"    => $date,
    "name"    => $name,
    "phone"   => $phone,
    "email"   => $email,
    "company" => $company,
    "role"    => $role,
    "program" => $program,
]);

$ch = curl_init($sheetsUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $sheetsData);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // важно! Google делает редирект
curl_exec($ch);
curl_close($ch);