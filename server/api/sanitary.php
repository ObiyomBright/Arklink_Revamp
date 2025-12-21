<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/config.php";

$limit  = 15;
$page   = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$offset = ($page - 1) * $limit;

$company    = $_GET['company'] ?? null;
$priceOrder = ($_GET['price'] ?? 'desc') === 'asc' ? 'ASC' : 'DESC';

$sql = "
SELECT 
  s.*,
  pi.local_url AS image
FROM sanitary s
LEFT JOIN product_images pi
  ON pi.product_id = s.id
 AND pi.product_type = 'sanitary'
WHERE 1=1
";

$params = [];
$types  = "";

if ($company) {
    $sql .= " AND s.company = ?";
    $params[] = $company;
    $types .= "s";
}

$sql .= " ORDER BY s.price $priceOrder LIMIT ? OFFSET ?";
$params[] = $limit;
$params[] = $offset;
$types .= "ii";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$BASE_IMAGE_URL = "http://localhost/Arklink/server/uploads/sanitary/";
$data = [];

while ($row = $result->fetch_assoc()) {
    $row['image'] = $row['image']
        ? $BASE_IMAGE_URL . basename($row['image'])
        : null;
    $data[] = $row;
}

echo json_encode([
    "page" => $page,
    "count" => count($data),
    "data" => $data
]);
