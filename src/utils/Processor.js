export function processText(input) {
  const hush = document.getElementById("flexRadioDefault2")?.checked;
  return input.replaceAll("<p1_Radio>", hush ? "_" : "");
}