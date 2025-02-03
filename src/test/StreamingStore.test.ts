import { describe, it, expect, beforeEach, vi } from "vitest";
import { streamingStore } from "../store/StreamingStore";
import { dispatcher } from "../dispatcher/Dispatcher";
import { ActionTypes } from "../actions/types";
import type { TCollectionComponent } from "../types";

describe("Tests for StreamingStore", () => {
  beforeEach(() => {
    // Reset store state
    dispatcher.dispatch({ type: ActionTypes.FETCH_HUB });
  });

  it("should initialize with default state", () => {
    const state = streamingStore.getState();
    expect(state).toEqual({
      collections: [],
      currentRow: 0,
      currentCol: 0,
      isModalOpen: false,
      loading: true,
    });
  });

  it("should update state on FETCH_HUB_SUCCESS", () => {
    const mockComponents: TCollectionComponent[] = [
      {
        _type: "collection",
        id: "1",
        href: "/test",
        name: "Test Collection",
        theme: "dark",
        artwork: {},
        items: [],
      },
    ];

    dispatcher.dispatch({
      type: ActionTypes.FETCH_HUB_SUCCESS,
      payload: mockComponents,
    });

    const state = streamingStore.getState();
    expect(state.loading).toBe(false);
    expect(state.collections).toHaveLength(1);
    expect(state.collections[0].id).toBe("1");
    expect(state.error).toBeUndefined();
  });

  it("should handle FETCH_HUB_EROR", () => {
    const errorMessage = "Failed to fetch";
    dispatcher.dispatch({
      type: ActionTypes.FETCH_HUB_ERROR,
      payload: errorMessage,
    });

    const state = streamingStore.getState();
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it("should update focus position", () => {
    dispatcher.dispatch({
      type: ActionTypes.UPDATE_FOCUS,
      payload: { row: 1, col: 2 },
    });

    const state = streamingStore.getState();
    expect(state.currentRow).toBe(1);
    expect(state.currentCol).toBe(2);
  });

  it("should handle modal state", () => {
    const mockItem = {
      id: "1",
      title: "Test title",
      description: "Description test",
      image: "test.webp",
    };

    dispatcher.dispatch({
      type: ActionTypes.SHOW_MODAL,
      payload: mockItem,
    });

    let state = streamingStore.getState();
    expect(state.isModalOpen).toBe(true);
    expect(state.currentItem).toEqual(mockItem);

    dispatcher.dispatch({ type: ActionTypes.CLOSE_MODAL });

    state = streamingStore.getState();
    expect(state.isModalOpen).toBe(false);
  });
});
