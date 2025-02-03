import { describe, it, expect, vi, beforeEach } from "vitest";
import { StreamingActions } from "../actions/StreamingActions";
import { dispatcher } from "../dispatcher/Dispatcher";
import { ActionTypes } from "../actions/types";
import * as api from "../api";

vi.mock("../api");
vi.mock("../dispatcher/Dispatcher", () => ({
  dispatcher: {
    dispatch: vi.fn(),
  },
}));

describe("StreamingActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchHub", () => {
    it("should dispatch success action when API call succeeds", async () => {
      const mockHub = {
        name: "Test Hub",
        components: [
          {
            id: "1",
            name: "Collection 1",
            items: [],
          },
        ],
      };

      vi.mocked(api.fetchHub).mockResolvedValue(mockHub);

      await StreamingActions.fetchHub();

      expect(dispatcher.dispatch).toHaveBeenCalledTimes(2);
      expect(dispatcher.dispatch).toHaveBeenCalledWith({
        type: ActionTypes.FETCH_HUB,
      });
      expect(dispatcher.dispatch).toHaveBeenCalledWith({
        type: ActionTypes.FETCH_HUB_SUCCESS,
        payload: mockHub.components,
      });
    });

    it("should dispatch error action when API call fails", async () => {
      const error = new Error("API Error");
      vi.mocked(api.fetchHub).mockRejectedValue(error);

      await StreamingActions.fetchHub();

      expect(dispatcher.dispatch).toHaveBeenCalledTimes(2);
      expect(dispatcher.dispatch).toHaveBeenCalledWith({
        type: ActionTypes.FETCH_HUB,
      });
      expect(dispatcher.dispatch).toHaveBeenCalledWith({
        type: ActionTypes.FETCH_HUB_ERROR,
        payload: error,
      });
    });
  });

  describe("fetchCollection", () => {
    it("should dispatch success action when API call succeeds", async () => {
      const mockCollection = {
        id: "123",
        name: "Test Collection",
        items: [],
      };

      vi.mocked(api.fetchCollection).mockResolvedValue(mockCollection);

      await StreamingActions.fetchCollection(mockCollection.id);

      expect(dispatcher.dispatch).toHaveBeenCalledTimes(2);
      expect(dispatcher.dispatch).toHaveBeenCalledWith({
        type: ActionTypes.FETCH_COLLECTION,
      });
      expect(dispatcher.dispatch).toHaveBeenCalledWith({
        type: ActionTypes.FETCH_COLLECTION_SUCCESS,
        payload: mockCollection,
      });
    });
  });

  describe("navigation actions", () => {
    it("should dispatch update focus action", () => {
      StreamingActions.updateFocus(1, 2);

      expect(dispatcher.dispatch).toHaveBeenCalledWith({
        type: ActionTypes.UPDATE_FOCUS,
        payload: { row: 1, col: 2 },
      });
    });

    it("should dispatch modal actions", () => {
      const mockItem = { id: "1", title: "Test", description: "Test", image: "test.webp" };

      StreamingActions.showModal(mockItem);
      expect(dispatcher.dispatch).toHaveBeenCalledWith({
        type: ActionTypes.SHOW_MODAL,
        payload: mockItem,
      });

      StreamingActions.closeModal();
      expect(dispatcher.dispatch).toHaveBeenCalledWith({
        type: ActionTypes.CLOSE_MODAL,
      });
    });
  });
});
