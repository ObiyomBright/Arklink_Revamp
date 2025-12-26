<?php
// CORS headers
header("Access-Control-Allow-Origin: https://lofloxy.store");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
require_once "config.php"; // must define $conn (mysqli)

// Read JSON body
$data = json_decode(file_get_contents("php://input"), true);

$orderId = $data['order_id'] ?? null;
$status  = $data['status'] ?? null;

// Allowed statuses (must match ENUM in DB)
$allowedStatuses = [
    'pending',
    'confirmed',
    'processing',
    'delivered',
    'cancelled'
];

// Validate input
if (!$orderId || !in_array($status, $allowedStatuses)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid order ID or status"]);
    exit;
}

// Start transaction
$conn->begin_transaction();

try {
    // Update order status
    $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    if (!$stmt) throw new Exception("Prepare failed: " . $conn->error);

    $stmt->bind_param("si", $status, $orderId);
    $stmt->execute();
    
    if ($stmt->affected_rows === 0) {
        throw new Exception("Order not found or status unchanged");
    }
    $stmt->close();

    // Insert into order_logs
    $logStmt = $conn->prepare("INSERT INTO order_logs (order_id, status, note) VALUES (?, ?, ?)");
    if (!$logStmt) throw new Exception("Prepare failed: " . $conn->error);

    $note = "Status updated by admin";
    $logStmt->bind_param("iss", $orderId, $status, $note);
    $logStmt->execute();
    $logStmt->close();

    // Commit transaction
    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Order status updated successfully"
    ]);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Failed to update order status",
        "error" => $e->getMessage()
    ]);
}
