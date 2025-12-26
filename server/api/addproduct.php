<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/* ===================== HEADERS & CORS ===================== */
$allowed_origin = "https://lofloxy.store";
header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "config.php";

/* ===================== SESSION ===================== */
$sessionLifetime = 60 * 60 * 24 * 30;
session_set_cookie_params([
    'lifetime' => $sessionLifetime,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

/* ===================== AUTH ===================== */
if (empty($_SESSION['logged_in']) || !in_array($_SESSION['role'] ?? '', ['admin', 'staff'])) {
    http_response_code(401);
    exit(json_encode([
        "status" => "error",
        "message" => "Unauthorized access"
    ]));
}

/* ===================== METHOD CHECK ===================== */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit(json_encode([
        "status" => "error",
        "message" => "Invalid request"
    ]));
}

/* ===================== FORM DATA ===================== */
$product_type = $_POST['product_type'] ?? "";
$name    = trim($_POST['name'] ?? "");
$company = trim($_POST['company'] ?? "");
$price   = trim($_POST['price'] ?? "");

/* ===================== VALIDATION ===================== */
if (!in_array($product_type, ['tile', 'sanitary'])) {
    exit(json_encode(["status" => "error", "message" => "Invalid product type"]));
}

if ($name === "" || $company === "" || $price === "") {
    exit(json_encode(["status" => "warning", "message" => "Required fields missing"]));
}

/* ===================== ESCAPE ===================== */
$name    = $conn->real_escape_string($name);
$company = $conn->real_escape_string($company);
$price   = floatval($price);

/* ===================== DUPLICATE CHECK ===================== */
if ($product_type === "tile") {
    $surface = $conn->real_escape_string($_POST['surface_type'] ?? "");
    $size    = $conn->real_escape_string($_POST['size'] ?? "");

    $checkSql = "
        SELECT id FROM tiles 
        WHERE name='$name' 
          AND company='$company' 
          AND surface_type='$surface' 
          AND size='$size'
        LIMIT 1
    ";
} else {
    $checkSql = "
        SELECT id FROM sanitary 
        WHERE name='$name' 
          AND company='$company'
        LIMIT 1
    ";
}

$checkResult = $conn->query($checkSql);
if (!$checkResult) {
    http_response_code(500);
    exit(json_encode(["status" => "error", "message" => $conn->error]));
}

if ($checkResult->num_rows > 0) {
    exit(json_encode([
        "status" => "warning",
        "message" => "Product already exists"
    ]));
}

/* ===================== IMAGE VALIDATION ===================== */
if (!isset($_FILES['image'])) {
    exit(json_encode(["status" => "error", "message" => "Image upload required"]));
}

$image = $_FILES['image'];
$maxFileSizeMB = 7;

if ($image['size'] > ($maxFileSizeMB * 1024 * 1024)) {
    exit(json_encode([
        "status" => "error",
        "message" => "Image exceeds {$maxFileSizeMB}MB limit"
    ]));
}

/* ===================== ONLY JPEG ===================== */
$extension = strtolower(pathinfo($image['name'], PATHINFO_EXTENSION));
if (!in_array($extension, ['jpg', 'jpeg'])) {
    exit(json_encode([
        "status" => "error",
        "message" => "Only JPEG images are allowed"
    ]));
}

/* ===================== UPLOAD PATH ===================== */
$uploadFolder = ($product_type === "tile")
    ? "../uploads/tiles/"
    : "../uploads/sanitary/";

if (!file_exists($uploadFolder)) {
    mkdir($uploadFolder, 0777, true);
}

/* ===================== IMAGE NAME ===================== */
$imageName  = time() . "_" . rand(1000, 9999) . ".jpg";
$targetFile = $uploadFolder . $imageName;

/* ===================== MOVE FILE ===================== */
if (!move_uploaded_file($image['tmp_name'], $targetFile)) {
    exit(json_encode([
        "status" => "error",
        "message" => "Failed to save image"
    ]));
}

/* ===================== INSERT PRODUCT ===================== */
if ($product_type === "tile") {
    $pieces = intval($_POST['pieces_per_carton'] ?? 0);
    $sqm    = floatval($_POST['sqm_per_carton'] ?? 0);

    $insertSql = "
        INSERT INTO tiles 
        (name, company, surface_type, size, pieces_per_carton, sqm_per_carton, price)
        VALUES
        ('$name','$company','$surface','$size',$pieces,$sqm,$price)
    ";
} else {
    $insertSql = "
        INSERT INTO sanitary (name, company, price)
        VALUES ('$name','$company',$price)
    ";
}

if (!$conn->query($insertSql)) {
    http_response_code(500);
    exit(json_encode([
        "status" => "error",
        "message" => $conn->error
    ]));
}

$productId = $conn->insert_id;

/* ===================== INSERT IMAGE ===================== */
$insertImageSql = "
    INSERT INTO product_images (product_type, product_id, local_url)
    VALUES ('$product_type', $productId, '$imageName')
";

if (!$conn->query($insertImageSql)) {
    http_response_code(500);
    exit(json_encode([
        "status" => "error",
        "message" => $conn->error
    ]));
}

/* ===================== SUCCESS ===================== */
echo json_encode([
    "status" => "success",
    "message" => "Product added successfully"
]);
exit;
