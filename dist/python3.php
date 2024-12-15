<?php
// Define the parameters
$imageSize = 196608; // Must be a multiple of block size (4096)
$baseDir = 'data';
$outputFile = 'Spiffs.bin';
$pageSize = 256;
$blockSize = 4096;
$objNameLen = 32;
$metaLen = 4;

// Construct the command
$command = "/opt/python3/bin/python3 spiffsgen.py $imageSize $baseDir $outputFile --page-size $pageSize --block-size $blockSize --obj-name-len $objNameLen --meta-len $metaLen --use-magic --use-magic-len";

// Execute the command
exec($command, $output, $return_var);

// Check the result
if ($return_var === 0) {
    echo "SPIFFS image created successfully: $outputFile\n";
} else {
    echo "Error creating SPIFFS image. Return code: $return_var\n";
    echo "Output:\n" . implode("\n", $output);
}
