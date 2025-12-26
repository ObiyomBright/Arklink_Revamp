<?php

$sessionLifetime = 60 * 60 * 24 * 30;

session_set_cookie_params([
    'lifetime' => $sessionLifetime,
    'path' => '/',
    'secure' => true, // true on HTTPS
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

$allowed_origin = "https://lofloxy.store";

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

// Escape input for manual query
$phoneEsc = $conn->real_escape_string($phone);

// Fetch user manually
$sql = "SELECT id, full_name, phone, password_hash, role 
        FROM users 
        WHERE phone = '$phoneEsc' 
        LIMIT 1";

$result = $conn->query($sql);

if (!$result || $result->num_rows === 0) {
    exit(json_encode(["status" => "error", "message" => "Invalid credentials"]));
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password_hash'])) {
    exit(json_encode(["status" => "error", "message" => "Invalid credentials"]));
}

// Check role
if (!in_array($user['role'], ['admin', 'staff'])) {
    exit(json_encode(["status" => "error", "message" => "Access denied"]));
}

// Regenerate session ID
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
