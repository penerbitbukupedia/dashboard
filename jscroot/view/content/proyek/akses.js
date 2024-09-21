import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { addCSSIn,onClick } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { id, backend } from "../../../url/config.js";
import { loadScript } from "../../../controller/main.js";
import { addNotificationCloseListeners, truncateText, addCopyButtonListeners, addRevealTextListeners } from "../../utils.js";
import {approvalButton} from "./buat/approval.js";

export async function main() {
  await addCSSIn(
    "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css",
    id.content
  );
  await addCSSIn("assets/css/custom.css", id.content);

  await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
  await loadScript("https://cdn.datatables.net/2.0.8/js/dataTables.min.js");

  getJSON(
    backend.project.approved,
    "login",
    getCookie("login"),
    getResponseFunction
  );

  addNotificationCloseListeners();
}

function getResponseFunction(result) {
  if (result.status === 200) {
    // Menambahkan baris untuk setiap webhook dalam data JSON
    console.log(result.data);
    result.data.forEach((project) => {
      const row = document.createElement("tr");
      const kepengarangan = generateKepengarangan(project);
      let statusDraft = project.draftpdfbuku ? "Ada" : "Belum";
      let warnaTombolstatusSPK = project.spk ? "is-success" : "is-warning";
      let statusSPI = project.spi ? "Ada" : "Belum";
      let warnaTombolstatusSPI = project.spi ? "is-success" : "is-warning";
      let hashview=backend.project.downloaddraft+btoa(project.draftpdfbuku);
      let urldraftbuku="https://naskah.bukupedia.co.id/view/#"+btoa(hashview);
      let hashviewspi=backend.project.downloaddraft+btoa(project.spi);
      let urlsampulbuku="https://naskah.bukupedia.co.id/view/#"+btoa(hashviewspi);

      const truncatedDescription = truncateText(project.description, 50);
      row.innerHTML = `
                <td>${project.name}<br>Judul: ${project.title}<br>
                    <a href="${project.pathkatalog}" target="_blank">Katalog Buku</a><br>
                    <a href="${urlsampulbuku}" target="_blank">SPI</a><br>
                    <a href="${urldraftbuku}" target="_blank">Draft Buku</a><br>
                    Jumlah Halaman: ${project.jumlahhalaman}<br>
                    Ukuran: ${project.ukuran}<br>
                </td>
                <td class="code-box">
                <button class="button ${warnaTombolstatusSPK} spkButton" id="approvalbutton" data-project-id="${project._id}" data-project-name="${project.name}">
                Info
                </button>
                <button class="button ${warnaTombolstatusSPK} spkButton" id="approvalbutton" data-project-id="${project._id}" data-project-name="${project.name}">
                Update
                </button>
                  <a class="tag is-link copy-btn" data-copy-text="${project.pathkatalog}">Copy</a>
                </td>
                <td class="code-box">
                <a href="https://wa.me/${project.owner.phonenumber}" target="_blank">${kepengarangan}</a>
                  <a class="tag is-link copy-btn" data-copy-text="${kepengarangan}">Copy</a> 
                </td>
                <td>${truncatedDescription}<span class="full-text" style="display:none; ">${project.description}</span></td>
            `;
      document.getElementById("webhook-table-body").appendChild(row);
    });

    $(document).ready(function () {
      $("#myTable").DataTable({
        responsive: true,
        autoWidth: false,
      });
    });

     addRevealTextListeners();
     addCopyButtonListeners();
     onClick("approvalbutton",approvalButton);
  } else {
    Swal.fire({
      icon: "error",
      title: result.data.status,
      text: result.data.response,
    });
  }
}



function generateKepengarangan(item) {
    // Dapatkan nama-nama penulis dari members
    const penulis = item.members?.map(member => member.name).join(', ') || '';

    // Dapatkan nama editor
    const editor = item.editor?.name || '';

    // Gabungkan penulis dan editor
    return `${penulis}${editor ? '; ' + editor : ''}`;
}
