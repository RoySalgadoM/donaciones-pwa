function createIconSvg(type, fill, colorBgIcon) {
  const svgPath =
    type.toLowerCase() === "success"
      ? "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"
      : type.toLowerCase() === "error"
      ? "M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
      : "";

  return `<svg class="flex-shrink-0 inline w-6 h-6 mr-3 ${colorBgIcon}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path ${
      type.toLowerCase() === "success"
        ? 'stroke-linecap="round" stroke-linejoin="round" stroke-width="1"'
        : type.toLowerCase() === "error"
        ? 'stroke-linecap="round" stroke-linejoin="round" stroke-width="1"'
        : ""
    } d="${svgPath}"/>
  </svg>`;
}

function show(type, message) {
  const colorMap = {
    success: "text-white bg-green-500 dark:bg-gray-800 dark:text-green-400",
    error: "text-white bg-red-500 dark:bg-gray-800 dark:text-red-400",
  };

  const colorBgIconMap = {
    success: "fill-white dark:fill-green-400",
    error: "fill-white dark:fill-red-400",
  };

  const colorBgIcon = colorBgIconMap[type.toLowerCase()] || "";
  const color = colorMap[type.toLowerCase()] || "";
  const fill = type.toLowerCase() === "success" ? "#22C55E" : "#EF4444";
  const icon = createIconSvg(type, fill, colorBgIcon);
  let random = Math.floor(Math.random() * 1000);

  const description =
    message !== undefined && message !== null && message !== "" ? message : "";

  const html = `<div id="notifyApp${-random.toString()}" class="fixed inset-x-0 top-0 flex items-start justify-center z-50 mt-2 animate-slide-up">
    <div class= "flex items-center p-4 mb-4 text-md rounded-lg ${color}">
      ${icon}
      <div>
        ${description}
      </div>
    </div>
  </div>`;

  const newDiv = document.createElement("div");
  newDiv.innerHTML = html;
  document.body.appendChild(newDiv);
  hide(`notifyApp${-random.toString()}`);
}

async function hide(id) {
  const notifyApp = document.getElementById(id);
  await new Promise((resolve) => setTimeout(resolve, 2500));
  notifyApp.remove();
}

export const notify = { show };
