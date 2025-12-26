<?php
session_start();

// =======================
// CORS HEADERS
// =======================
header("Access-Control-Allow-Origin: https://lofloxy.store");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../api/config.php';

// =======================
// Input validation
// =======================
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_NUMBER_INT);
$password = trim($_POST['password'] ?? '');

if (!$phone || !$password || strlen($password) < 6) {
    http_response_code(400);
    exit(json_encode([
        "status" => "error",
        "message" => "Invalid input"
    ]));
}

// =======================
// Hash password
// =======================
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// =======================
// Update password in DB
// =======================
$stmt = $conn->prepare("UPDATE users SET password_hash = ?, reset_code = NULL WHERE phone = ?");
if (!$stmt) {
    http_response_code(500);
    exit(json_encode([
        "status" => "error",
        "message" => "Database prepare failed"
    ]));
}

$stmt->bind_param("ss", $password_hash, $phone);

if ($stmt->execute()) {
    $stmt->close();
    echo json_encode([
        "status" => "success",
        "message" => "Password reset successfully"
    ]);
} else {
    $stmt->close();
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Failed to reset password"
    ]);
}
exit();
