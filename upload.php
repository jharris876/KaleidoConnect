<?php
if(isset($_POST['submit'])){
    // Handle form submission

    // 1. Validate input
    $name = $_POST['name'];
    
    // 2. Handle file upload
    $target_dir = "C:\Users\jacob\Documents\Personal Projects\restTest\uploads";
    $target_file = $target_dir . basename($_FILES["document"]["name"]);

    if (move_uploaded_file($_FILES["document"]["tmp_name"], $target_file)) {
        // 3. Store data (e.g., store file path in a database)
        // Here you can store $name and $target_file in your database or perform any other actions
        
        // 4. Provide feedback to the user
        echo "The file ". htmlspecialchars( basename( $_FILES["document"]["name"])). " has been uploaded.";
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}
?>

