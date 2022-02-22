
function modalSetup(){
    const modalcontainer = document.querySelector(".modal-container");
    const confirmBtn = document.querySelector("#confirm");

    confirmBtn.addEventListener("click", () => {
        const nameValue = document.querySelector("#name").value;
        if (!nameValue) return;
        modalcontainer.classList.add("hidde");
    })
}
    

