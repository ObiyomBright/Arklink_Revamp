<?php
// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once "config.php";

$sql = "
SELECT 
  o.id AS order_id,
  o.phone,
  o.delivery_address,
  o.total_amount,
  o.status,
  o.created_at,
  oi.product_name,
  oi.price,
  oi.quantity,
  oi.item_total
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
ORDER BY o.created_at DESC
";

$result = $conn->query($sql);

$orders = [];

while ($row = $result->fetch_assoc()) {
    $id = $row['order_id'];

    if (!isset($orders[$id])) {
        $orders[$id] = [
            "id" => $id,
            "phone" => $row['phone'],
            "delivery_address" => $row['delivery_address'],
            "total_amount" => $row['total_amount'],
            "status" => $row['status'],
            "created_at" => $row['created_at'],
            "items" => []
        ];
    }

    $orders[$id]["items"][] = [
        "name" => $row['product_name'],
        "price" => $row['price'],
        "quantity" => $row['quantity'],
        "item_total" => $row['item_total']
    ];
}

echo json_encode(array_values($orders));
