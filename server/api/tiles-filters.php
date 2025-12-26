<?php


header("Access-Control-Allow-Origin: https://lofloxy.store");
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

// Helper function to get distinct values manually
function getDistinctValues($conn, $column, $table) {
    $values = [];
    $sql = "SELECT DISTINCT $column FROM $table";
    $result = $conn->query($sql);
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $values[] = $row[$column];
        }
    }
    return $values;
}

$response['sizes'] = getDistinctValues($conn, 'size', 'tiles');
$response['surface_types'] = getDistinctValues($conn, 'surface_type', 'tiles');
$response['companies'] = getDistinctValues($conn, 'company', 'tiles');

echo json_encode($response);
