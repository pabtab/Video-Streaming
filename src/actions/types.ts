export enum ActionTypes {
  FETCH_HUB = "FETCH_HUB",
  FETCH_HUB_SUCCESS = "FETCH_HUB_SUCCESS",
  FETCH_HUB_ERROR = "FETCH_HUB_ERROR",
  FETCH_COLLECTION = "FETCH_COLLECTION",
  FETCH_COLLECTION_SUCCESS = "FETCH_COLLECTION_SUCCESS",
  FETCH_COLLECTION_ERROR = "FETCH_COLLECTION_ERROR",
  UPDATE_FOCUS = "UPDATE_FOCUS",
  SHOW_MODAL = "SHOW_MODAL",
  CLOSE_MODAL = "CLOSE_MODAL",
}

export interface Action<T = any> {
  type: ActionTypes;
  payload?: T;
}
