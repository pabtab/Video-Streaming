import { streamingStore } from "./store/StreamingStore";
import { StreamingActions } from "./actions/StreamingActions";

class Navigation {
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
            StreamingActions.showModal(item);
          }
          return;
      }

      StreamingActions.updateFocus(newRow, newCol);
    });
  }
}

export const navigation = new Navigation();
