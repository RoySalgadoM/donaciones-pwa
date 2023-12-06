import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config.js";

function transformHexa(color) {
  color = color.replace("#", "");

  const expandedHex = color
    .split("")
    .map((char) => char.repeat(2))
    .join("");
  return `#${expandedHex}`;
}

function calculateTextColor(bgColor, pseudoClass) {
  let finalTextColor = "";

  const fullConfig = resolveConfig(tailwindConfig);

  const [color, scale] = bgColor.replace(/.*bg-/, "").split("-");

  let colorFromTailwind = null;

  if (scale) {
    colorFromTailwind = fullConfig.theme.colors[color][scale];
  } else {
    colorFromTailwind = fullConfig.theme.colors[color];
  }

  if (colorFromTailwind.includes("#") && colorFromTailwind.length == 4) {
    colorFromTailwind = transformHexa(colorFromTailwind);
  }

  let colorRGB = null;
  if (colorFromTailwind.includes("--color-")) {
    colorFromTailwind = colorFromTailwind
      .replace("rgb(var(", "")
      .replace(/\)/g, "");
    colorRGB = getComputedStyle(document.documentElement)
      .getPropertyValue(colorFromTailwind)
      .trim()
      .replace(/ /g, "")
      .split(",");
  } else {
    let rgbValue = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      colorFromTailwind
    );
    colorRGB = rgbValue
      ? [
          parseInt(rgbValue[1], 16),
          parseInt(rgbValue[2], 16),
          parseInt(rgbValue[3], 16),
        ]
      : [];
  }

  // Calcular la luminancia del color
  const luminancia =
    (0.299 * colorRGB[0] + 0.587 * colorRGB[1] + 0.114 * colorRGB[2]) / 255;

  // Retornar blanco o negro basándose en la luminancia
  switch (pseudoClass) {
    case "hover":
      finalTextColor = bgColor.includes("dark")
        ? luminancia > 0.5
          ? "dark:hover:text-black"
          : "dark:hover:text-white"
        : luminancia > 0.5
        ? "hover:text-black"
        : "hover:text-white";
      break;
    case "placeholder":
      finalTextColor = bgColor.includes("dark")
        ? luminancia > 0.5
          ? "dark:placeholder:text-black"
          : "dark:placeholder:text-white"
        : luminancia > 0.5
        ? "placeholder:text-black"
        : "placeholder:text-white";
      break;
    case "fill":
      finalTextColor = luminancia > 0.5 ? "fill-black" : "fill-white";
      break;
    case "border":
      finalTextColor = bgColor.includes("dark")
        ? luminancia > 0.5
          ? "dark:border-black"
          : "dark:border-white"
        : luminancia > 0.5
        ? "border-black"
        : "border-white";
      break;
    case "outline":
      finalTextColor = bgColor.includes("dark")
        ? luminancia > 0.5
          ? "dark:outline-black"
          : "dark:outline-white"
        : luminancia > 0.5
        ? "outline-black"
        : "outline-white";
      break;
    default:
      finalTextColor = bgColor.includes("dark")
        ? luminancia > 0.5
          ? "dark:text-black"
          : "dark:text-white"
        : luminancia > 0.5
        ? "text-black"
        : "text-white";
      break;
  }

  return finalTextColor;
}

export { calculateTextColor };

export function transformToParamsString(params) {
  if (!(typeof params === "object")) return "";
  let paramsString = "?";
  Object.keys(params).map((key) => {
    paramsString +=
      params[key] !== null && params[key] !== undefined && params[key] !== ""
        ? `${key}=${params[key]}&`
        : "";
  });
  paramsString = paramsString.slice(0, -1);
  paramsString = encodeURI(paramsString);
  paramsString = paramsString.replace(/#/g, "%23");
  paramsString = paramsString.replace(/\[/g, "%5B");
  paramsString = paramsString.replace(/\]/g, "%5D");
  return paramsString;
}
