function show() {
  let styles = `
    <style>
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    </style>`;
  var styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  let html = `
    <div id="loadingApp" class="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
      <svg class="animate-spin -ml-1 mr-3 h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
      </svg>
    </div>`;

  var newDiv = document.createElement("div");
  newDiv.innerHTML = html;
  document.body.appendChild(newDiv);
}

function hide() {
  let loadingApp = document.getElementById("loadingApp");
  if (loadingApp) {
    loadingApp.remove();
  }
}

export const loading = { show, hide };
