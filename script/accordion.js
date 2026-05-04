document.querySelectorAll(".js-accordion").forEach( accordion =>{
    const items = accordion.querySelectorAll(".js-accordion-item");

    items.forEach(item => {
        const content = item.querySelector(".js-accordion-content");

        item.addEventListener("click", () => {
            const isOpen = item.classList.contains("active");

            items.forEach(i => {
                i.classList.remove("active");
                i.querySelector(".js-accordion-content").style.maxHeight = null;
            });

            if (!isOpen){
                item.classList.add("active");
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
} );