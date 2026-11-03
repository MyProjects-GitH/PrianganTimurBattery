const contactForm = document.querySelector("#contact-form");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const email = formData.get("email");
    const message = [
        "Halo Priangan Timur Battery, saya ingin menghubungi Anda.",
        "",
        `Nama: ${formData.get("nama")}`,
        `Nomor telepon: ${formData.get("telepon")}`,
        email ? `Email: ${email}` : null,
        `Topik: ${formData.get("topik")}`,
        `Pesan: ${formData.get("pesan")}`
    ].filter(Boolean).join("\n");

    const whatsappUrl = `https://wa.me/6282115399000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});