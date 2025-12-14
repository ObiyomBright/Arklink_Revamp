<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json; charset=UTF-8');

require_once __DIR__ . '/../api/config.php';

$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_NUMBER_INT);
$password = trim($_POST['password'] ?? '');

if (!$phone || !$password || strlen($password) < 6) {
    exit(json_encode(["status" => "error", "message" => "Invalid input"]));
}

// Hash password
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Update password and clear code
$stmt = $conn->prepare("UPDATE users SET password_hash = ?, reset_code = NULL WHERE phone = ?");
$stmt->bind_param("ss", $password_hash, $phone);

if ($stmt->execute()) {
    $stmt->close();
    exit(json_encode(["status" => "success", "message" => "Password reset successfully"]));
} else {
    $stmt->close();
    exit(json_encode(["status" => "error", "message" => "Failed to reset password"]));
}
