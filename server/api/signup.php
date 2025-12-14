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

// Retrieve and sanitize inputs
$name = trim($_POST['name'] ?? '');
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_NUMBER_INT);
$password = trim($_POST['password'] ?? '');

// Basic validations
if (!$name || !$phone || !$password) {
    exit(json_encode(["status" => "error", "message" => "Name, phone, and password are required."]));
}

if (!preg_match('/^[0-9]{11}$/', $phone)) {
    exit(json_encode(["status" => "error", "message" => "Phone number must be exactly 11 digits."]));
}

if (strlen($password) < 6) {
    exit(json_encode(["status" => "error", "message" => "Password must be at least 6 characters long."]));
}

// Check if phone already exists
$sql_check = "SELECT id FROM users WHERE phone = ? LIMIT 1";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $phone);
$stmt_check->execute();
$result_check = $stmt_check->get_result();
if ($result_check->num_rows > 0) {
    $stmt_check->close();
    exit(json_encode(["status" => "error", "message" => "Phone number already registered."]));
}
$stmt_check->close();

// Hash the password
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Insert user into database
$sql_insert = "INSERT INTO users (full_name, phone, password_hash) VALUES (?, ?, ?)";
$stmt_insert = $conn->prepare($sql_insert);
$stmt_insert->bind_param("sss", $name, $phone, $password_hash);

if ($stmt_insert->execute()) {
    $stmt_insert->close();
    exit(json_encode([
        "status" => "success",
        "message" => "Account created successfully",
        "full_name" => $name,
        "phone" => $phone
    ]));
} else {
    $stmt_insert->close();
    exit(json_encode(["status" => "error", "message" => "Failed to create account. Please try again."]));
}
