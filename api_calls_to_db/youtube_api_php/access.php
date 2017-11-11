<?php
$LOCAL_ACCESS = true;
require('./access_databas/mysqli_connect.php');
$output = [
    'success' => false,
    'errors' => []
];
function output_and_exit($output){
    $json_output = json_encode($output);
    print($json_output);
}
if(empty($_POST['action'])){
    $output['errors'][] = "NO ACTION GIVEN";
    output_and_exit($output);
}
switch($_POST['action']){
    case 'read_channels_from_youtube':
        include('read_channels_from_youtube.php');
        break;
    case 'read_videos_from_youtube':
        include('read_videos_from_youtube');
        break;
    default:
        $output['errors'][] = "INVALID ACTION";
        break;
};
output_and_exit($output);
?>
