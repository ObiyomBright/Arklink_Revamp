<?php


// Set CORS headers
header("Access-Control-Allow-Origin: https://lofloxy.store");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/config.php";

// Pagination
$limit  = 15;
$page   = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$offset = ($page - 1) * $limit;

// Filters
$size       = $_GET['size'] ?? null;
$surface    = $_GET['surface_type'] ?? null;
$company    = $_GET['company'] ?? null;
$priceOrder = (isset($_GET['price']) && $_GET['price'] === 'asc') ? 'ASC' : 'DESC';

// Base query
$sql = "
SELECT 
    t.*,
    pi.local_url AS image
FROM tiles t
LEFT JOIN product_images pi
    ON pi.product_id = t.id
    AND pi.product_type = 'tile'
WHERE 1=1
";

// Apply filters safely with manual escaping
if ($size) {
    $sql .= " AND t.size = '" . $conn->real_escape_string($size) . "'";
}

if ($surface) {
    $sql .= " AND t.surface_type = '" . $conn->real_escape_string($surface) . "'";
}

if ($company) {
    $sql .= " AND t.company = '" . $conn->real_escape_string($company) . "'";
}

// Add ordering, limit, and offset
$sql .= " ORDER BY t.price $priceOrder LIMIT $limit OFFSET $offset";

// Execute query
$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database query failed: " . $conn->error
    ]);
    exit;
}

// Prepare response
$BASE_IMAGE_URL = "https://lofloxy.store/server/uploads/tiles/";
$data = [];

while ($row = $result->fetch_assoc()) {
    if (!empty($row['image'])) {
        $row['image'] = $BASE_IMAGE_URL . basename($row['image']);
    } else {
        $row['image'] = null;
    }
    $data[] = $row;
}

// Return JSON response
echo json_encode([
    "page" => $page,
    "count" => count($data),
    "data" => $data
]);
?>
