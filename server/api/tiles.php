<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/config.php";

$limit  = 15;
$page   = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$offset = ($page - 1) * $limit;

$size       = $_GET['size'] ?? null;
$surface    = $_GET['surface_type'] ?? null;
$company    = $_GET['company'] ?? null;
$priceOrder = (isset($_GET['price']) && $_GET['price'] === 'asc') ? 'ASC' : 'DESC';

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

$params = [];
$types  = "";

if ($size) {
    $sql .= " AND t.size = ?";
    $params[] = $size;
    $types .= "s";
}

if ($surface) {
    $sql .= " AND t.surface_type = ?";
    $params[] = $surface;
    $types .= "s";
}

if ($company) {
    $sql .= " AND t.company = ?";
    $params[] = $company;
    $types .= "s";
}

$sql .= " ORDER BY t.price $priceOrder LIMIT ? OFFSET ?";
$params[] = $limit;
$params[] = $offset;
$types .= "ii";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$BASE_IMAGE_URL = "http://localhost/Arklink/server/uploads/tiles/";

$data = [];

while ($row = $result->fetch_assoc()) {
    if (!empty($row['image'])) {
        $row['image'] = $BASE_IMAGE_URL . basename($row['image']);
    } else {
        $row['image'] = null;
    }
    $data[] = $row;
}

echo json_encode([
    "page" => $page,
    "count" => count($data),
    "data" => $data
]);
