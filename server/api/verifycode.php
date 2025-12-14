<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json; charset=UTF-8');

require_once __DIR__ . '/../api/config.php';

$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_NUMBER_INT);
$code = trim($_POST['code'] ?? '');

if (!$phone || !$code) {
    exit(json_encode(["status" => "error", "message" => "Phone and code are required"]));
}

// Check code
$stmt = $conn->prepare("SELECT id FROM users WHERE phone = ? AND reset_code = ? LIMIT 1");
$stmt->bind_param("ss", $phone, $code);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    exit(json_encode(["status" => "error", "message" => "Invalid code"]));
}

exit(json_encode(["status" => "success", "message" => "Code verified"]));
