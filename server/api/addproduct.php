<?php

$sessionLifetime = 60 * 60 * 24 * 30;

session_set_cookie_params([
    'lifetime' => $sessionLifetime,
    'path' => '/',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

$allowed_origin = "http://localhost:5173";

header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 🔐 AUTH CHECK
if (
    empty($_SESSION['logged_in']) ||
    !in_array($_SESSION['role'] ?? '', ['admin', 'staff'])
) {
    http_response_code(401);
    exit(json_encode([
        "status" => "error",
        "message" => "Unauthorized access"
    ]));
}

require_once "config.php";

// ===== REQUEST METHOD =====
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    exit(json_encode([
        "status" => "error",
        "message" => "Invalid request"
    ]));
}

$product_type = $_POST['product_type'] ?? "";
$name = trim($_POST['name'] ?? "");
$company = trim($_POST['company'] ?? "");
$price = trim($_POST['price'] ?? "");

if (!in_array($product_type, ['tile', 'sanitary'])) {
    exit(json_encode(["status" => "error", "message" => "Invalid product type"]));
}

if ($name === "" || $company === "" || $price === "") {
    exit(json_encode(["status" => "warning", "message" => "Required fields missing"]));
}

/* =========================================================
   🔍 CHECK IF PRODUCT ALREADY EXISTS
========================================================= */

if ($product_type === "tile") {
    $surface = $_POST['surface_type'] ?? "";
    $size = $_POST['size'] ?? "";

    $checkStmt = $conn->prepare(
        "SELECT id FROM tiles 
         WHERE name = ? AND company = ? AND surface_type = ? AND size = ? 
         LIMIT 1"
    );
    $checkStmt->bind_param("ssss", $name, $company, $surface, $size);
} else {
    $checkStmt = $conn->prepare(
        "SELECT id FROM sanitary 
         WHERE name = ? AND company = ? 
         LIMIT 1"
    );
    $checkStmt->bind_param("ss", $name, $company);
}

$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    $checkStmt->close();
    exit(json_encode([
        "status" => "warning",
        "message" => "Product already exists"
    ]));
}

$checkStmt->close();

/* =========================================================
   📷 IMAGE VALIDATION
========================================================= */

if (!isset($_FILES['image'])) {
    exit(json_encode(["status" => "error", "message" => "Image upload required"]));
}

$image = $_FILES['image'];
$maxFileSizeMB = 7;

if ($image['size'] > ($maxFileSizeMB * 1024 * 1024)) {
    exit(json_encode(["status" => "error", "message" => "Image exceeds 7MB limit"]));
}

$uploadFolder = ($product_type === "tile")
    ? "../uploads/tiles/"
    : "../uploads/sanitary/";

if (!file_exists($uploadFolder)) {
    mkdir($uploadFolder, 0777, true);
}

$imageName = time() . "_" . rand(1000, 9999) . ".webp";
$targetFile = $uploadFolder . $imageName;

$extension = strtolower(pathinfo($image["name"], PATHINFO_EXTENSION));

switch ($extension) {
    case 'jpg':
    case 'jpeg':
        $source = imagecreatefromjpeg($image["tmp_name"]);
        break;
    case 'png':
        $source = imagecreatefrompng($image["tmp_name"]);
        break;
    case 'webp':
        $source = imagecreatefromwebp($image["tmp_name"]);
        break;
    default:
        exit(json_encode([
            "status" => "error",
            "message" => "Invalid image format. Only JPG, PNG, WEBP allowed"
        ]));
}

$maxWidth = 1600;
$width = imagesx($source);
$height = imagesy($source);

if ($width > $maxWidth) {
    $newWidth = $maxWidth;
    $newHeight = floor($height * ($newWidth / $width));
    $resized = imagecreatetruecolor($newWidth, $newHeight);
    imagecopyresampled($resized, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
    $source = $resized;
}

imagewebp($source, $targetFile, 90);
imagedestroy($source);

/* =========================================================
   💾 SAVE PRODUCT
========================================================= */

if ($product_type === "tile") {
    $pieces = $_POST['pieces_per_carton'];
    $sqm = $_POST['sqm_per_carton'];

    $stmt = $conn->prepare(
        "INSERT INTO tiles 
        (name, company, surface_type, size, pieces_per_carton, sqm_per_carton, price)
        VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "ssssidd",
        $name,
        $company,
        $surface,
        $size,
        $pieces,
        $sqm,
        $price
    );
} else {
    $stmt = $conn->prepare(
        "INSERT INTO sanitary (name, company, price) VALUES (?, ?, ?)"
    );
    $stmt->bind_param("ssd", $name, $company, $price);
}

$stmt->execute();
$productId = $stmt->insert_id;
$stmt->close();

$stmt2 = $conn->prepare(
    "INSERT INTO product_images (product_type, product_id, local_url)
     VALUES (?, ?, ?)"
);
$stmt2->bind_param("sis", $product_type, $productId, $imageName);
$stmt2->execute();
$stmt2->close();

echo json_encode([
    "status" => "success",
    "message" => "Product added successfully"
]);
exit();
