import type { Collection, CollectionItem } from "./types";
import { getImageUrl } from "./api";
import { streamingStore } from "./store/StreamingStore";
import { StreamingActions } from "./actions/StreamingActions";

export class UIManager {
  private content: HTMLElement;
  private modal: HTMLElement;
  private intersectionObserver: IntersectionObserver;

  constructor() {
    this.content = document.getElementById("content")!;
    this.modal = document.getElementById("modal")!;
    this.setupKeyboardNavigation();
    streamingStore.subscribeComponent(() => this.render());

    this.intersectionObserver = this.setupInfinitieScroll();
  }

  public async init(): Promise<void> {
    await StreamingActions.fetchHub();
  }

  private render() {
    const state = streamingStore.getState();

    if (state.loading) {
      this.content.innerHTML = "<p>Loading...</p>";
      return;
    }

    if (state.error) {
      this.renderError(state.error);
      return;
    }

    this.renderCollections(state.collections);
    this.updateFocus(state.currentRow, state.currentCol);

    if (state.isModalOpen && state.currentItem) {
      this.showModal(state.currentItem);
    } else {
      this.closeModal();
    }
  }

  public renderImage(collection: Collection, rowIndex: number) {
    return collection.items
      .map(
        (item, colIndex) => `
      <div class="item" data-row="${rowIndex}" data-col="${colIndex}">
        <div class="item-image">
          <img src="${getImageUrl(item.image, 400, 200)}"
              alt="${item.title} poster"
              onerror="this.src='${getImageUrl(item.logo, 200, 200)}'; this.alt='image-failed'"
              loading="lazy">
          <img class="item-image-watermark" src="${getImageUrl(
            item.watermark,
            100,
            100
          )}" alt="watermark">
        </div>
        <h2 class="item-title">${item.title}</h2>
        <h3 class="item-subtitle">${item?.rating ?? "No rating"} - ${item.genre} - ${
          item.premiereDate?.substring(0, 4) ?? ""
        }</h3>
      </div>
    `
      )
      .join("");
  }

  public renderCollections(collections: Collection[]) {
    this.content.innerHTML = collections
      .map(
        (collection, rowIndex) => `
          <div class="collection" data-row="${rowIndex}" data-id="${collection.id}" aria-label="${
          collection.name
        } collection">
            <h1 id="collection-${
              collection.id
            }" class="collection-title">${collection.name?.toLocaleUpperCase()}</h1>
            <div class="items-row" role="list" aria-labelledby="collection-${collection.id}">
                ${this.renderImage(collection, rowIndex)}
            </div>
          </div>
        `
      )
      .join("");

    document.querySelectorAll(".collection").forEach((collection) => {
      const collectionId = collection.getAttribute("data-id");
      if (collectionId) {
        this.intersectionObserver.observe(collection);
      }
    });
  }

  public setupKeyboardNavigation() {
    document.addEventListener("keydown", (event) => {
      const state = streamingStore.getState();

      let newRow = state.currentRow;
      let newCol = state.currentCol;

      if (state.isModalOpen) {
        if (event.key === "Escape" || event.key === "Backspace") {
          StreamingActions.closeModal();
        }
        return;
      }

      switch (event.key) {
        case "ArrowUp":
          if (newRow > 0) newRow--;
          break;
        case "ArrowDown":
          if (newRow < streamingStore.getMaxRows() - 1) newRow++;
          break;
        case "ArrowLeft":
          if (newCol > 0) newCol--;
          break;
        case "ArrowRight":
          if (newCol < streamingStore.getMaxCols(newRow) - 1) newCol++;
          break;
        case "Enter":
          const item = state.collections[newRow]?.items[newCol];
          if (item) {
            console.log(item);
            StreamingActions.showModal(item);
          }
          return;
      }

      StreamingActions.updateFocus(newRow, newCol);
    });
  }

  public updateFocus(row: number, col: number) {
    const previousFocus = document.querySelector(".item.focused");
    const newFocus = document.querySelector(`.item[data-row="${row}"][data-col="${col}"]`);

    previousFocus?.classList.remove("focused");
    previousFocus?.setAttribute("aria-selected", "false");

    if (newFocus) {
      newFocus.classList.add("focused");
      newFocus.setAttribute("aria-selected", "true");
      (newFocus as HTMLElement).focus();
      newFocus.scrollIntoView({ block: "center" });
    }
  }

  public showModal(item: CollectionItem) {
    const modalTitle = document.getElementById("modal-collection-title")!;
    const modalGenre = document.getElementById("modal-collection-genre")!;
    const modalDescription = document.getElementById("modal-collection-description")!;
    const modalImg = document.getElementById("modal-collection-image")!;

    modalTitle.textContent = item.title;
    modalGenre.textContent = item.genre || "";
    modalDescription.textContent = item.description;
    (modalImg as HTMLImageElement).src = getImageUrl(item.image, 400, 200);
    (modalImg as HTMLImageElement).onerror = function () {
      this.src = getImageUrl(item.logo, 400, 200);
    };
    this.modal.setAttribute("aria-labelledby", `modal-${item.title}`);
    this.modal.setAttribute("aria-describedby", "modal-collection-description modal-collection-genre");

    this.modal.classList.remove("hidden");
  }

  public closeModal() {
    this.modal.classList.add("hidden");
    this.modal.setAttribute("aria-hidden", "true");
  }

  public setupInfinitieScroll() {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const state = streamingStore.getState();
          const collectionsMap = new Map(
            state.collections.map((collection) => [collection.id, collection])
          );
          if (entry.isIntersecting) {
            const collection = entry.target as HTMLElement;
            const collectionId = collection.dataset.id;

            if (collectionId && !collectionsMap.get(collectionId)?.items.length) {
              console.log(collectionsMap.get(collectionId));
              StreamingActions.fetchCollection(collectionId);
              this.intersectionObserver.unobserve(entry.target);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );
  }

  public renderError(message: string) {
    this.content.innerHTML = `
      <p>Failed to load content. Please try again later.</p>
      <p>Error: ${message}</p>
    `;
  }
}
