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
if (!$phone || !preg_match('/^[0-9]{11}$/', $phone)) {
    exit(json_encode(["status" => "error", "message" => "Invalid phone number"]));
}

// Check if user exists
$stmt = $conn->prepare("SELECT id FROM users WHERE phone = ? LIMIT 1");
$stmt->bind_param("s", $phone);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    exit(json_encode(["status" => "error", "message" => "Phone number not registered"]));
}

// Generate 4-digit code
$code = str_pad(rand(0, 9999), 4, "0", STR_PAD_LEFT);

// Save code in db
$stmt = $conn->prepare("UPDATE users SET reset_code = ? WHERE phone = ?");
$stmt->bind_param("ss", $code, $phone);
$stmt->execute();
$stmt->close();

// Send code via WhatsApp (Termii)
$curl = curl_init();

$data = array(
    "phone_number" => "234" . ltrim($phone, "0"), // Format with country code
    "device_id" => "a9302848-4f1d-47ef-96da-aa96da47e276",
    "template_id" => "53bf703e-dd3d-4f71-88b2-7b86f4c1c28e",
    "api_key" => "TLIAYKlYbyZwMIPnfdUOgyswysOeyOislkXpBPOqAonILiiTaEDuDZEMYKbMQN",
    "data" => array(
        "code" => $code, // Send the 4-digit code
    )
);

curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://v3.api.termii.com/api/send/template',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
));

$response = curl_exec($curl);
$http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

if (curl_errno($curl)) {
    $error_message = curl_error($curl);
    curl_close($curl);
    exit(json_encode(['status' => 'error', 'message' => $error_message]));
}

curl_close($curl);

exit(json_encode([
    "status" => "success",
    "message" => "Code sent successfully via WhatsApp",
    "termii_response" => json_decode($response, true),
    "http_code" => $http_code
]));
