document.addEventListener("DOMContentLoaded", function() {
  // Replace 'your_app_download_url' with the actual URL to download your application
  const downloadUrl = 'your_app_download_url';
  
  const downloadLink = document.getElementById("downloadLink");
  downloadLink.addEventListener("click", function(event) {
    event.preventDefault();
    // You can perform any additional actions here before initiating the download
    initiateDownload(downloadUrl);
  });

  function initiateDownload(url) {
    // You can add more logic here, such as tracking the download or showing a loading spinner.
    window.location.href = url;
  }
});
