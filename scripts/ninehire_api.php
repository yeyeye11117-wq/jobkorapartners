<?php
require_once __DIR__ . "/vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$apiKey = $_ENV["NINEHIRE_API_KEY"];

$base = "https://api.ninehire.com/api/v1/jobs";
$query = $_SERVER['QUERY_STRING'] ?? "";

$url = $base . "?" . $query;

$headers = [
    "Authorization: Bearer " . $apiKey,
    "Accept: application/json"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

echo $response;
