<?php
// =======================
// CORS HEADERS
// =======================
header("Access-Control-Allow-Origin: https://lofloxy.store");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "config.php";

$response = [];

// =======================
// Fetch distinct companies
// =======================
$sql = "SELECT DISTINCT company FROM sanitary ORDER BY company ASC";
$result = $conn->query($sql);

if ($result) {
    $companies = [];
    while ($row = $result->fetch_assoc()) {
        $companies[] = $row['company'];
    }
    $response['companies'] = $companies;
} else {
    http_response_code(500);
    $response['error'] = "Failed to fetch companies";
}

echo json_encode($response);
exit();
