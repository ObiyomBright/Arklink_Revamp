<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");
header('Content-Type: application/json; charset=UTF-8');


require_once __DIR__ . '/../api/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(["status" => "error", "message" => "Method Not Allowed"]));
}

$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_NUMBER_INT);
$password = $_POST['password'] ?? null;
$password = trim($password);

if (!$phone || !$password) {
    exit(json_encode(["status" => "error", "message" => "Phone and password required."]));
}

if (strlen($phone) !== 11) {
    exit(json_encode(["status" => "error", "message" => "Invalid phone number format"]));
}

$sql = "SELECT id, full_name, phone, password_hash, role FROM users WHERE phone = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $phone);

$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

// Check user existence
if (!$user) {
    exit(json_encode(["status" => "error", "message" => "User not found"]));
}

// Verify password
if (!password_verify($password, $user['password_hash'])) {
    exit(json_encode(["status" => "error", "message" => "Incorrect password"]));
}

if ($user['role'] !== 'staff' && $user['role'] !== 'admin') {
        exit(json_encode(["status" => "error", "message" => "Login is restricted to staff only"]));
}

session_regenerate_id(true);
$_SESSION['user_id'] = $user['id'];
$_SESSION['full_name'] = $user['full_name'];
$_SESSION['phone'] = $user['phone'];
$_SESSION['role'] = $user['role'];
$_SESSION['logged_in'] = true;
$_SESSION['last_activity'] = time();

exit(json_encode([
    "status" => "success",
    "message" => "Login successful",
    "full_name" => $user['full_name'],
    "phone" => $user['phone'],
    "role" => $user['role']
]));
