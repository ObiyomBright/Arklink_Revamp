<?php

$sessionLifetime = 60 * 60 * 24 * 30;

session_set_cookie_params([
    'lifetime' => $sessionLifetime,
    'path' => '/',
    'secure' => false, // true on HTTPS
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

$allowed_origin = "http://localhost:5173";

header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../api/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(["status" => "error", "message" => "Method Not Allowed"]));
}

$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_NUMBER_INT);
$password = trim($_POST['password'] ?? '');

if (!$phone || !$password) {
    exit(json_encode(["status" => "error", "message" => "Phone and password required"]));
}

$sql = "SELECT id, full_name, phone, password_hash, role FROM users WHERE phone = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $phone);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$user || !password_verify($password, $user['password_hash'])) {
    exit(json_encode(["status" => "error", "message" => "Invalid credentials"]));
}

if (!in_array($user['role'], ['admin', 'staff'])) {
    exit(json_encode(["status" => "error", "message" => "Access denied"]));
}

session_regenerate_id(true);

$_SESSION = [
    'user_id' => $user['id'],
    'full_name' => $user['full_name'],
    'phone' => $user['phone'],
    'role' => $user['role'],
    'logged_in' => true,
    'last_activity' => time()
];

echo json_encode([
    "status" => "success",
    "full_name" => $user['full_name'],
    "phone" => $user['phone'],
    "role" => $user['role']
]);
