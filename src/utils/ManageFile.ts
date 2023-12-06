async function readContentTxt(
  txtFile: File
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    try {
      let reader: FileReader = new FileReader();
      reader.onload = function (e) {
        let output = e.target?.result ?? null;
        resolve(output);
      };
      reader.readAsText(txtFile);
    } catch (error) {
      reject(error);
    }
  });
}

function getTypeFileFromExtension(extFile): string | null {
  let type: string | null = null;
  if (!extFile) {
    return type;
  }
  extFile = extFile.toString().toLowerCase();
  if (
    extFile === "jpeg" ||
    extFile === "png" ||
    extFile === "jpg" ||
    extFile === "tiff" ||
    extFile === "tif"
  ) {
    type = `image/${extFile}`;
  } else if (extFile === "txt") {
    type = "text/plain";
  } else if (extFile === "mp4") {
    type = "video/mp4";
  } else if (extFile === "xls" || extFile === "xlsx") {
    type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  } else if (extFile === "pdf") {
    type = "application/pdf";
  }
  return type;
}

function getB64FromArrayBits(
  arrayBits: string | ArrayBuffer,
  ext: string
): string {
  let type = getTypeFileFromExtension(ext);
  return `data:${type};base64,${arrayBits}`;
}

function getExtensionFromName(nameFile: string): string {
  let words: string[] = nameFile.split(".");
  let ext: string = words[words.length - 1];
  return ext;
}

function urlFileFromB64(data: string, nameFile: string): string | null {
  try {
    if (!nameFile || !data) {
      return null;
    }
    let file = convertBase64ToFile(data, nameFile);
    if (!file) {
      return null;
    }
    let fileURL = URL.createObjectURL(file);
    return fileURL;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function convertFileToBase64(
  file: File
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    try {
      //Check File is not Empty
      if (!!file) {
        // Select the very first file from list
        let fileToLoad: File = file;
        // FileReader function for read the file.
        let fileReader: FileReader = new FileReader();
        let base64: string | ArrayBuffer | null;
        // Onload of file read the file content
        fileReader.onload = function (fileLoadedEvent) {
          base64 = fileLoadedEvent.target?.result ?? null;
          resolve(base64);
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
      }
    } catch (error) {
      reject(error);
    }
  });
}

function convertBase64ToFile(fileData: string, nameFile: string): File | null {
  try {
    if (!nameFile || !fileData) {
      return null;
    }
    let wordsName: string[] = nameFile.split(".");
    let ext: string = wordsName[wordsName.length - 1];
    let type: string | null = getTypeFileFromExtension(ext);
    let fileDataFinal: string = fileData.replace(/&#43;/g, "+");
    fileDataFinal = fileDataFinal.replace(/&#61;/g, "=");
    let byteCharacters: string = atob(fileDataFinal);
    let byteNumbers: Array<number> = new Array(byteCharacters.length);
    for (let i: number = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray: Uint8Array = new Uint8Array(byteNumbers);
    let file = new File([byteArray], nameFile, { type: type ?? "" });
    return file;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function downloadFileFromLink(link: string, name: string) {
  let linkA: HTMLAnchorElement = document.createElement("a");
  linkA.setAttribute("download", name);
  linkA.href = link;
  document.body.appendChild(linkA);
  linkA.click();
  linkA.remove();
}

async function downloadFileFromStreamFile(
  streamData: ArrayBuffer,
  nameFile: string
) {
  try {
    console.log(
      "El mime",
      getTypeFileFromExtension(getExtensionFromName(nameFile))
    );
    const blob: Blob = new Blob([streamData], {
      type: getTypeFileFromExtension(getExtensionFromName(nameFile)) ?? "",
    });
    let link: string = URL.createObjectURL(blob);
    downloadFileFromLink(link, nameFile);
  } catch (error) {
    throw error;
  } finally {
  }
}
const methods = {
  readContentTxt,
  getTypeFileFromExtension,
  getB64FromArrayBits,
  getExtensionFromName,
  urlFileFromB64,
  convertFileToBase64,
  convertBase64ToFile,
  downloadFileFromLink,
  downloadFileFromStreamFile,
};
export default { ...methods };
