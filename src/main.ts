import { fetchHub } from "./api";

document.addEventListener("DOMContentLoaded", () => {
  const data = fetchHub();
  console.log(data);
});
