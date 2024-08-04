export function base64UrlEncode(uint8Array: Uint8Array) {
    // Convert Uint8Array to a binary string
    let binaryString = "";
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
  
    // Encode the binary string as Base64
    const base64String = btoa(binaryString);
  
    // Convert Base64 to Base64 URL encoding
    const base64UrlString = base64String
      .replace(/\+/g, "-") // Replace + with -
      .replace(/\//g, "_") // Replace / with _
      .replace(/=+$/, ""); // Remove padding
  
    return base64UrlString;
  }