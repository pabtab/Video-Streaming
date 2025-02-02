import { dispatcher } from "../dispatcher/Dispatcher";
import { ActionTypes } from "./types";
import { fetchHub, fetchCollection } from "../api";
import type { CollectionItem } from "../types";

export const StreamingActions = {
  async fetchHub() {
    dispatcher.dispatch({ type: ActionTypes.FETCH_HUB });

    try {
      const hub = await fetchHub();
      dispatcher.dispatch({
        type: ActionTypes.FETCH_HUB_SUCCESS,
        payload: hub.components,
      });
    } catch (error) {
      dispatcher.dispatch({
        type: ActionTypes.FETCH_HUB_ERROR,
        payload: error,
      });
    }
  },

  updateFocus(row: number, col: number) {
    dispatcher.dispatch({
      type: ActionTypes.UPDATE_FOCUS,
      payload: { row, col },
    });
  },

  showModal(item: CollectionItem) {
    dispatcher.dispatch({
      type: ActionTypes.SHOW_MODAL,
      payload: item,
    });
  },

  closeModal() {
    dispatcher.dispatch({ type: ActionTypes.CLOSE_MODAL });
  },

  async fetchCollection(id: string) {
    dispatcher.dispatch({ type: ActionTypes.FETCH_COLLECTION });

    try {
      const collection = await fetchCollection(id);
      dispatcher.dispatch({
        type: ActionTypes.FETCH_COLLECTION_SUCCESS,
        payload: collection,
      });
    } catch (error) {
      dispatcher.dispatch({
        type: ActionTypes.FETCH_COLLECTION_ERROR,
        payload: error,
      });
    }
  },
};
