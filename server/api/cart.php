<?php
// =======================
// CORS HEADERS (MUST BE FIRST)
// =======================
header("Access-Control-Allow-Origin: https://lofloxy.store");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// =======================
// DB CONNECTION
// =======================
require_once "config.php"; // mysqli connection $conn

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['items'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid order data"
    ]);
    exit;
}

$phone   = preg_replace('/\D/', '', $data['phone']);
$address = trim($data['address']);
$items   = $data['items'];

if (!$phone || !$address) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Phone and address are required"
    ]);
    exit;
}

// =======================
// CALCULATE TOTAL
// =======================
$total = 0;
foreach ($items as $item) {
    $total += ((float)$item['price'] * (int)$item['quantity']);
}

// =======================
// ESCAPE DATA FOR SQL
// =======================
$phoneEsc   = $conn->real_escape_string($phone);
$addressEsc = $conn->real_escape_string($address);

// =======================
// TRANSACTION
// =======================
$conn->begin_transaction();

try {
    // 1️⃣ Insert order
    $insertOrderSql = "
        INSERT INTO orders (phone, delivery_address, total_amount)
        VALUES ('$phoneEsc', '$addressEsc', $total)
    ";

    if (!$conn->query($insertOrderSql)) {
        throw new Exception("Order insert failed: " . $conn->error);
    }

    $orderId = $conn->insert_id;

    // 2️⃣ Insert order items
    foreach ($items as $item) {
        $type     = $conn->real_escape_string($item['type']);
        $id       = intval($item['id']);
        $name     = $conn->real_escape_string($item['name']);
        $price    = floatval($item['price']);
        $quantity = intval($item['quantity']);
        $itemTotal = $price * $quantity;

        $insertItemSql = "
            INSERT INTO order_items
            (order_id, product_type, product_id, product_name, price, quantity, item_total)
            VALUES ($orderId, '$type', $id, '$name', $price, $quantity, $itemTotal)
        ";

        if (!$conn->query($insertItemSql)) {
            throw new Exception("Order item insert failed: " . $conn->error);
        }
    }

    // 3️⃣ Send WhatsApp via Termii
    $payload = [
        "phone_number" => "2347089830948", // Site owner
        "device_id"    => "a9302848-4f1d-47ef-96da-aa96da47e276",
        "template_id"  => "53bf703e-dd3d-4f71-88b2-7b86f4c1c28e",
        "api_key"      => "TLIAYKlYbyZwMIPnfdUOgyswysOeyOislkXpBPOqAonILiiTaEDuDZEMYKbMQN",
        "data" => [
            "orderId" => (string)$orderId,
            "amount"  => number_format($total, 2),
            "phone"   => $phone
        ]
    ];

    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => "https://v3.api.termii.com/api/send/template",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
        CURLOPT_TIMEOUT => 10
    ]);
    curl_exec($curl);
    curl_close($curl);

    // 4️⃣ Commit
    $conn->commit();

    echo json_encode([
        "success" => true,
        "orderId" => $orderId
    ]);

} catch (Throwable $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Order failed: " . $e->getMessage()
    ]);
}
