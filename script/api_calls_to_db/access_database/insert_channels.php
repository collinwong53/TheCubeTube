<?php
if(empty($LOCAL_ACCESS)){
    die('insert channel, direct access not allowed');
}
$youtube_channel_id = $_POST['youtube_channel_id'];
$channel_title = $_POST['channel_title'];
$description = $_POST['description'];
$thumbnail = $_POST['thumbnail'];
$date = date('Y-m-d H:i:s');
if(empty($youtube_channel_id)){
    $output['errors'][]='MISSING YOUTUBE CHANNEL ID';
}
//tm87
// if(!preg_match('/[a-zA-Z0-9\-\_]{24}/', $youtube_channel_id)){
//     $output['errors'][] = 'INVALID YOUTUBE CHANNEL ID';
//     output_and_exit($output);
// }
if(empty($channel_title)){
    $output['errors'][]='MISSING CHANNEL TITLE';
}
//tm87
// if(!preg_match('/[a-zA-Z0-9]{6,20}/', $channel_title)){
//     $output['errors'][] = 'INVALID YOUTUBE CHANNEL TITLE';
//     output_and_exit($output);
// }

if(empty($description)){
    $output['errors'][] = 'MISSING CHANNEL DESCRIPTION';
}
if(empty($thumbnail)){
    $output['errors'][] = 'MISSING THUMBNAILS';
}
$stmt = $conn->prepare("INSERT INTO channels SET 
channel_title = ?, 
youtube_channel_id = ?,
description = ?, 
thumbnail_file_name = ?, 
date_created=?,
last_channel_pull=?");
$stmt->bind_param('ssssss',$channel_title,$youtube_channel_id,
$description,$thumbnail,$date,$date);
$stmt->execute();
if(empty($stmt)){
    $output['errors'][]='invalid query';
}else{
    if($conn->affected_rows>0){
        $output['success'] = true;
    }else{
        $output['errors'][]='UNABLE TO INSERT';
    }
}
?>