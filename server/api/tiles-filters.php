<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "config.php";

$response = [];

$response['sizes'] = array_column(
  $conn->query("SELECT DISTINCT size FROM tiles")->fetch_all(MYSQLI_ASSOC),
  'size'
);

$response['surface_types'] = array_column(
  $conn->query("SELECT DISTINCT surface_type FROM tiles")->fetch_all(MYSQLI_ASSOC),
  'surface_type'
);

$response['companies'] = array_column(
  $conn->query("SELECT DISTINCT company FROM tiles")->fetch_all(MYSQLI_ASSOC),
  'company'
);

echo json_encode($response);
