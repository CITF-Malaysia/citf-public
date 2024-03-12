"use strict";


if (entries.length > 0) {

  let noData = document.querySelector(".no-data");
  noData.classList.add("hidden");
  let entryTable = document.querySelector(".root-cert-table");
  entryTable.classList.remove("hidden");

  for (let entry of entries) {
    let entryTR = document.createElement("tr");
    let entryName =  document.createElement("td");
    let entryValue =  document.createElement("td");
    entryName.textContent = entry;
    entryValue.textContent = backgroundPage.rootCertStats[entry];

    entryTR.appendChild(entryName);
    entryTR.appendChild(entryValue);
    entryTable.appendChild(entryTR);
  }
}
