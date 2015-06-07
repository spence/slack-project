
export default new class RandomKey {

  generate() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
  }

}
