//this is to remove the repetitive part of the pages such as footer and possibly header
window.addEventListener('DOMContentLoaded', () => {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
          document.getElementById('footer').innerHTML = data;
           const tooltipTriggerList = document.querySelectorAll('[data-tooltip]');
            tooltipTriggerList.forEach(el => {
            new Tooltip(el);
            });
        })
        .catch(error => console.error('Error loading footer:', error));
});

/* for when calling multiple, for now we're only doing footer 8/7/2025
<div id="footer-placeholder"></div> sample on html
<script>
  window.addEventListener('DOMContentLoaded', () => {
    const components = {
      'header-placeholder': 'header.html',
      'navbar-placeholder': 'navbar.html',
      'sidebar-placeholder': 'sidebar.html',
      'footer-placeholder': 'footer.html'
    };

    for (const [id, file] of Object.entries(components)) {
      fetch(file)
        .then(res => res.text())
        .then(html => {
          document.getElementById(id).innerHTML = html;
        })
        .catch(err => console.error(`Error loading ${file}:`, err));
    }
  });
</script>

*/