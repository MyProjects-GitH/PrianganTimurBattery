const mobileCarouselMedia = window.matchMedia("(max-width: 560px)");
const carouselCloneClass = "mobile-carousel-clone";

function createCarouselClone(card, position) {
    const clone = card.cloneNode(true);
    clone.classList.add(carouselCloneClass, `${carouselCloneClass}--${position}`);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelector("img")?.setAttribute("alt", "");
    clone.querySelectorAll("a, button, input, select, textarea, [tabindex]")
        .forEach((element) => element.setAttribute("tabindex", "-1"));
    return clone;
}

function centerCarouselCard(grid, card) {
    if (!card) {
        return;
    }

    const cardLeft = card.getBoundingClientRect().left
        - grid.getBoundingClientRect().left
        + grid.scrollLeft;

    grid.scrollLeft = cardLeft
        - (grid.clientWidth - card.clientWidth) / 2;
}

function initializeLoopingCarousel(grid, cardSelector) {
    let scrollEndTimer;

    function setCarouselForViewport() {
        const existingClones = grid.querySelectorAll(`.${carouselCloneClass}`);
        const cards = grid.querySelectorAll(`${cardSelector}:not(.${carouselCloneClass})`);

        if (!mobileCarouselMedia.matches) {
            existingClones.forEach((clone) => clone.remove());
            grid.scrollLeft = 0;
            return;
        }

        if (cards.length === 0) {
            return;
        }

        if (existingClones.length === 0) {
            grid.prepend(createCarouselClone(cards[cards.length - 1], "leading"));
            grid.append(createCarouselClone(cards[0], "trailing"));
        }

        centerCarouselCard(grid, cards[0]);
    }

    function handleCarouselScroll() {
        window.clearTimeout(scrollEndTimer);
        scrollEndTimer = window.setTimeout(() => {
            const cards = grid.querySelectorAll(cardSelector);
            const viewportCenter = grid.getBoundingClientRect().left + grid.clientWidth / 2;
            let nearestCard = null;
            let nearestDistance = Infinity;

            cards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const distance = Math.abs(rect.left + rect.width / 2 - viewportCenter);

                if (distance < nearestDistance) {
                    nearestCard = card;
                    nearestDistance = distance;
                }
            });

            const originalCards = grid.querySelectorAll(`${cardSelector}:not(.${carouselCloneClass})`);

            if (nearestCard?.classList.contains(`${carouselCloneClass}--leading`)) {
                centerCarouselCard(grid, originalCards[originalCards.length - 1]);
            } else if (nearestCard?.classList.contains(`${carouselCloneClass}--trailing`)) {
                centerCarouselCard(grid, originalCards[0]);
            }
        }, 150);
    }

    grid.addEventListener("scroll", handleCarouselScroll, { passive: true });
    setCarouselForViewport();
    mobileCarouselMedia.addEventListener("change", setCarouselForViewport);
}

[
].forEach(([gridSelector, cardSelector]) => {
    const grid = document.querySelector(gridSelector);

    if (!grid) {
        return;
    }

    initializeLoopingCarousel(grid, cardSelector);
});
