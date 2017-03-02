
var messageDecrypt = (message, key) => {
  var decrypted = CryptoJS.AES.decrypt(message, key)
  var plaintext = decrypted.toString(CryptoJS.enc.Utf8);
  return (plaintext);
}
