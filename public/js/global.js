/* ============================================================
   GLOBAL THEME
   ============================================================ */

const themeButton = document.getElementById("theme-btn");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
}


function updateThemeIcon() {

    if (!themeButton) return;

    const icon = themeButton.querySelector("i");

    if (!icon) return;

    if (document.body.classList.contains("dark-mode")) {

        icon.className = "fa-solid fa-sun";

    } else {

        icon.className = "fa-solid fa-moon";

    }
}


updateThemeIcon();


if (themeButton) {

    themeButton.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const isDark =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        updateThemeIcon();

    });

}


/* ============================================================
   MODALS
   ============================================================ */

document.addEventListener("click", (event) => {

    const openButton =
        event.target.closest("[data-open-modal]");

    if (openButton) {

        const modalId =
            openButton.dataset.openModal;

        const modal =
            document.getElementById(modalId);

        if (modal) {

            modal.classList.add("active");

        }

    }


    const closeButton =
        event.target.closest("[data-close-modal]");

    if (closeButton) {

        const modal =
            closeButton.closest(".modal-overlay");

        if (modal) {

            modal.classList.remove("active");

        }

    }

});


/* ============================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ============================================================ */

document.addEventListener("click", (event) => {

    if (
        event.target.classList.contains("modal-overlay")
    ) {

        event.target.classList.remove("active");

    }

});


/* ============================================================
   ACTION DROPDOWNS
   ============================================================ */

document.addEventListener("click", (event) => {

    const toggle =
        event.target.closest(".action-toggle");

    if (toggle) {

        const dropdown =
            toggle.parentElement.querySelector(
                ".action-menu-dropdown"
            );

        document
            .querySelectorAll(".action-menu-dropdown.active")
            .forEach(menu => {

                if (menu !== dropdown) {

                    menu.classList.remove("active");

                }

            });

        dropdown?.classList.toggle("active");

        return;

    }


    if (
        !event.target.closest(".action-menu")
    ) {

        document
            .querySelectorAll(".action-menu-dropdown.active")
            .forEach(menu => {

                menu.classList.remove("active");

            });

    }

});