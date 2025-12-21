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

if ($product_type !== "tile" && $product_type !== "sanitary") {
    echo json_encode(["status" => "error", "message" => "Invalid product type"]);
    exit();
}

if ($name === "" || $company === "" || $price === "") {
    echo json_encode(["status" => "warning", "message" => "Required fields missing"]);
    exit();
}

if (!isset($_FILES['image'])) {
    echo json_encode(["status" => "error", "message" => "Image upload required"]);
    exit();
}

// Image validation
$image = $_FILES['image'];
$maxFileSizeMB = 7;
if ($image['size'] > ($maxFileSizeMB * 1024 * 1024)) {
    echo json_encode(["status" => "error", "message" => "Image exceeds 5MB limit"]);
    exit();
}

// Determine upload folder
$uploadFolder = ($product_type === "tile") ? "../uploads/tiles/" : "../uploads/sanitary/";
if (!file_exists($uploadFolder)) mkdir($uploadFolder, 0777, true);

// Convert to WebP filename
$imageName = time() . "_" . rand(1000, 9999) . ".webp";
$targetFile = $uploadFolder . $imageName;

// Load GD image
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
        echo json_encode(["status" => "error", "message" => "Invalid image format. Only JPG, PNG, WEBP allowed"]);
        exit();
}

// Resize if extremely large (over 1600px width)
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

// Save as WebP — Quality 90 (near lossless)
imagewebp($source, $targetFile, 90);
imagedestroy($source);

// SAVE TO DATABASE
if ($product_type === "tile") {
    $surface = $_POST['surface_type'];
    $size = $_POST['size'];
    $pieces = $_POST['pieces_per_carton'];
    $sqm = $_POST['sqm_per_carton'];

    $stmt = $conn->prepare("INSERT INTO tiles (name, company, surface_type, size, pieces_per_carton, sqm_per_carton, price)
VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "ssssidd",
        $name,        // s
        $company,     // s
        $surface,     // s
        $size,        // s  
        $pieces,      // i
        $sqm,         // d
        $price        // d
    );

    $stmt->execute();
    $productId = $stmt->insert_id;
    $stmt->close();
} else {
    $stmt = $conn->prepare("INSERT INTO sanitary (name, company, price) VALUES (?, ?, ?)");
    $stmt->bind_param("ssd", $name, $company, $price);

    $stmt->execute();
    $productId = $stmt->insert_id;
    $stmt->close();
}

$stmt2 = $conn->prepare("INSERT INTO product_images (product_type, product_id, local_url) VALUES (?, ?, ?)");
$stmt2->bind_param("sis", $product_type, $productId, $imageName);
$stmt2->execute();
$stmt2->close();

echo json_encode(["status" => "success", "message" => "Product added successfully"]);
exit();
