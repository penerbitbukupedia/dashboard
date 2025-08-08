import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {validateUserName} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.8/validate.js";
import {getValue} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.8/element.js";
import {putJSON} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/api.js";
import { backend } from "../../../../url/config.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/cookie.js";

export async function updateButton(target){
    const projectId = target.getAttribute("data-project-id");
    const projectName = target.getAttribute("data-project-name");
    const isbn = target.getAttribute("data-project-isbn");
    const terbit = target.getAttribute("data-project-terbit");
    const linkplaybook = target.getAttribute("data-project-linkplaybook");
    const linkgramed = target.getAttribute("data-project-linkgramed");
    const linkkubuku = target.getAttribute("data-project-linkkubuku");
    const linkmyedisi = target.getAttribute("data-project-linkmyedisi");
    const linkdepositperpusnas = target.getAttribute("data-project-linkdepositperpusnas");
    const linkdepositperpusda = target.getAttribute("data-project-linkdepositperpusda");
    const noresiisbn = target.getAttribute("data-project-noresiisbn");
    const { value: formValues } = await Swal.fire({
    title: "Publish Draft Buku",
    html: `
        <div class="field">
        <div class="control">
            <label class="label">Nama Project</label>
            <input type="hidden" id="project-id" name="projectId" value="${projectId}">
            <input class="input" type="text" value="${projectName}" disabled>
        </div>
        </div>
        <div class="field">
        <label class="label">No. ISBN</label>
        <div class="control">
            <input value="${isbn}" class="input" type="text" id="isbn" name="isbn" placeholder="ISBN dari Perpusnas">
        </div>
        </div>
        <div class="field">
        <label class="label">Tanggal Terbit</label>
        <div class="control">
            <input value="${terbit}" class="input" type="text" id="terbit" name="terbit" placeholder="terbit">
        </div>
        </div>
        <div class="field">
        <label class="label">URL Google Play Book</label>
        <div class="control">
            <input value="${linkplaybook}" class="input" type="text" id="linkplaybook" name="linkplaybook" placeholder="linkplaybook">
        </div>
        </div>
        <div class="field">
        <label class="label">URL Gramedia</label>
        <div class="control">
            <input value="${linkgramed}" class="input" type="text" id="linkgramed" name="linkgramed" placeholder="linkgramed">
        </div>
        </div>
        <div class="field">
        <label class="label">URL Kubuku</label>
        <div class="control">
            <input value="${linkkubuku}" class="input" type="text" id="linkkubuku" name="linkkubuku" placeholder="linkkubuku">
        </div>
        </div>
        <div class="field">
        <label class="label">URL MyEdisi</label>
        <div class="control">
            <input value="${linkmyedisi}" class="input" type="text" id="linkmyedisi" name="linkmyedisi" placeholder="linkmyedisi">
        </div>
        </div>
        <div class="field">
        <label class="label">URL Deposit Perpusnas</label>
        <div class="control">
            <input value="${linkdepositperpusnas}" class="input" type="text" id="linkdepositperpusnas" name="linkdepositperpusnas" placeholder="linkdepositperpusnas">
        </div>
        </div>
        <div class="field">
        <label class="label">URL Deposit Perpusda</label>
        <div class="control">
            <input value="${linkdepositperpusda}" class="input" type="text" id="linkdepositperpusda" name="linkdepositperpusda" placeholder="linkdepositperpusda">
        </div>
        </div>
        <div class="field">
        <label class="label">Nomor Resi ISBN</label>
        <div class="control">
            <input value="${noresiisbn}" class="input" type="text" id="noresiisbn" name="noresiisbn" placeholder="noresiisbn">
        </div>
        </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Publish",
    didOpen: () => {
        // Memanggil fungsi onInput setelah dialog SweetAlert2 dibuka
        //onInput("approve", validateUserName);
    },
    preConfirm: () => {
        const projectId = getValue("project-id");
        const isbn = getValue("isbn");
        const terbit = getValue("terbit");
        const linkplaybook = getValue("linkplaybook");
        const linkgramed = getValue("linkgramed");
        const linkkubuku = getValue("linkkubuku");
        const linkmyedisi = getValue("linkmyedisi");
        const linkdepositperpusnas = getValue("linkdepositperpusnas");
        const linkdepositperpusda = getValue("linkdepositperpusda");
        const noresiisbn = getValue("noresiisbn");
        if (!noresiisbn) {
        Swal.showValidationMessage(`Nomor Resi ISBN Harus Ada`);
        return false;
    }
        return { projectId,isbn,terbit,linkplaybook,linkgramed,linkkubuku,linkmyedisi,linkdepositperpusnas,linkdepositperpusda,noresiisbn };
    },
    });

    if (formValues) {
        const { projectId,isbn,terbit,linkplaybook,linkgramed,linkkubuku,linkmyedisi,linkdepositperpusnas,linkdepositperpusda,noresiisbn } = formValues;
        // Logic to add member
        //onInput("phonenumber", validatePhoneNumber);
        let idprjusr = {
            _id: projectId,
            isbn,terbit,linkplaybook,linkgramed,linkkubuku,linkmyedisi,linkdepositperpusnas,linkdepositperpusda,noresiisbn

        };
        putJSON(
            backend.project.publishbuku,
            "login",
            getCookie("login"),
            idprjusr,
            postResponseFunction
        );
    }
}


function postResponseFunction(result) {
    if (result.status === 200) {
      const katakata =
        "Berhasil approve draft buku project " + result.data.name;
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text:
          "Selamat kak proyek " +
          result.data.name +
          " dengan ID: " +
          result.data._id +
          " sudah di approved",
        footer:
          '<a href="https://wa.me/628999710040?text=' +
          katakata +
          '" target="_blank">Verifikasi Proyek</a>',
        didClose: () => {
          reloadDataTable();
        },
      });
    } else {
      Swal.fire({
        icon: "error",
        title: result.data.status,
        text: result.data.response,
      });
    }
    console.log(result);
  }