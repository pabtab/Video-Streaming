import { dispatcher } from "../dispatcher/Dispatcher";
import { ActionTypes, type Action } from "../actions/types";
import type { Collection, CollectionItem, TCollectionComponent } from "../types";
import { EventEmitter } from "./EventEmitter";
import { santizeCollection } from "../utils";

interface State {
  collections: Collection[];
  currentRow: number;
  currentCol: number;
  isModalOpen: boolean;
  currentItem?: CollectionItem;
  error?: string;
  loading: boolean;
}

class StreamingStore extends EventEmitter {
  private state: State = {
    collections: [],
    currentRow: 0,
    currentCol: 0,
    isModalOpen: false,
    loading: false,
  };

  constructor() {
    super();
    this.registerToDispatcher();
  }

  private registerToDispatcher() {
    dispatcher.register((action: Action) => {
      switch (action.type) {
        case ActionTypes.FETCH_HUB:
          this.state.loading = true;
          this.emit();
          break;

        case ActionTypes.FETCH_HUB_SUCCESS:
          this.state.collections = action.payload.map((component: TCollectionComponent) =>
            santizeCollection(component)
          );
          this.state.loading = false;
          this.state.error = undefined;
          this.emit();
          break;

        case ActionTypes.FETCH_HUB_ERROR:
          this.state.error = action.payload;
          this.state.loading = false;
          this.emit();
          break;

        case ActionTypes.UPDATE_FOCUS:
          const { row, col } = action.payload;
          this.state.currentRow = row;
          this.state.currentCol = col;
          this.emit();
          break;

        case ActionTypes.SHOW_MODAL:
          this.state.currentItem = action.payload;
          this.state.isModalOpen = true;
          this.emit();
          break;

        case ActionTypes.CLOSE_MODAL:
          this.state.isModalOpen = false;
          this.emit();
          break;

        case ActionTypes.FETCH_COLLECTION_SUCCESS:
          const newCollection = action.payload as TCollectionComponent;
          const newCollections = this.state.collections.map((collection) =>
            collection.id === newCollection.id ? santizeCollection(newCollection) : collection
          );
          this.state.collections = [...newCollections];
          this.emit();

          break;

        case ActionTypes.FETCH_COLLECTION_ERROR:
          console.error("Failed to fetch collection:", action.payload);
          break;
      }
    });
  }

  public getState(): State {
    return { ...this.state };
  }

  public getMaxRows(): number {
    return this.state.collections.length;
  }

  public getMaxCols(row: number): number {
    return this.state.collections[row]?.items.length ?? 0;
  }
}

export const streamingStore = new StreamingStore();
