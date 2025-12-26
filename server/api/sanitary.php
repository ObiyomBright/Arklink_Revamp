<?php
header("Access-Control-Allow-Origin: https://lofloxy.store");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/config.php";

$limit  = 15;
$page   = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$offset = ($page - 1) * $limit;

$company    = $_GET['company'] ?? null;
$priceOrder = ($_GET['price'] ?? 'desc') === 'asc' ? 'ASC' : 'DESC';

// Base SQL
$sql = "
SELECT 
  s.id, s.name, s.company, s.price,
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

// Prepare statement
$stmt = $conn->prepare($sql);
if ($types) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();

// Fetch results manually
$stmt->store_result();
$stmt->bind_result($id, $name, $comp, $price, $image);

$BASE_IMAGE_URL = "http://lofloxy.store/server/uploads/sanitary/";
$data = [];

while ($stmt->fetch()) {
    $data[] = [
        "id"      => $id,
        "name"    => $name,
        "company" => $comp,
        "price"   => (float)$price,
        "image"   => $image ? $BASE_IMAGE_URL . basename($image) : null
    ];
}

$stmt->close();

echo json_encode([
    "page"  => $page,
    "count" => count($data),
    "data"  => $data
]);
exit();
