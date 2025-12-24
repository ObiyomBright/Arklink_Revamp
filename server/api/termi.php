<?php
// =======================
// CORS HEADERS (if testing via browser)
// =======================
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// =======================
// Termii Test Configuration
// =======================
$phone_number = "2347089830948"; // Owner’s WhatsApp number in international format
$device_id    = "a9302848-4f1d-47ef-96da-aa96da47e276"; // Your Termii device ID
$template_id  = "53bf703e-dd3d-4f71-88b2-7b86f4c1c28e"; // Approved template ID
$api_key      = "YOUR_TERMII_API_KEY"; // Replace with your actual Termii API key

// =======================
// Data for template
// Make sure the keys match exactly your approved template variables
// For example, if your template placeholders are <%orderId%>, <%amount%>, <%phone%>
// =======================
$data = [
    "orderId" => "1234",
    "amount"  => "15000",
    "phone"   => "08123456789"
];

// =======================
// Prepare payload
// =======================
$payload = [
    "phone_number" => $phone_number,
    "device_id"    => $device_id,
    "template_id"  => $template_id,
    "api_key"      => $api_key,
    "data"         => $data
];

// =======================
// cURL request
// =======================
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://v3.api.termii.com/api/send/template",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json"
    ],
    CURLOPT_TIMEOUT => 10
]);

$response = curl_exec($curl);
$curl_error = curl_error($curl);
curl_close($curl);

// =======================
// Check Termii response
// =======================
if ($curl_error) {
    echo json_encode([
        "success" => false,
        "message" => "cURL Error: " . $curl_error
    ]);
    exit;
}

$response_data = json_decode($response, true);

// Log response to file for debugging
file_put_contents("termii_response.txt", $response . PHP_EOL, FILE_APPEND);

// =======================
// Return response for API testing
// =======================
echo json_encode([
    "success" => true,
    "response" => $response_data
]);
