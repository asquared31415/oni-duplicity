import { SaveGame } from "oni-save-parser";
import createCachedSelector from "re-reselect";

import { AppState } from "@/state";

import {
  getSaveItemTitle,
  getSaveItemChildPaths
} from "@/services/save-structure";

import oniSaveSelector from "@/selectors/oni-save-selector";
import selectedPathSelector from "@/selectors/selected-path-selector";

import { SaveStructureItemProps } from "./props";
import { Intent } from "@/theme";

const cacheKeyGenerator = (_: AppState, props: SaveStructureItemProps) =>
  props.saveItemPath.join(".");

const itemPathSelector = (_: AppState, props: SaveStructureItemProps) =>
  props.saveItemPath;

const title = createCachedSelector<
  AppState,
  SaveStructureItemProps,
  string[],
  SaveGame | null,
  string
>(
  itemPathSelector,
  oniSaveSelector,
  (path, saveGame) =>
    saveGame ? getSaveItemTitle(path, saveGame) : "[undefined]"
)(cacheKeyGenerator);

const selectionStatus = createCachedSelector<
  AppState,
  SaveStructureItemProps,
  string[],
  string[],
  "unselected" | "in-path" | "selected"
>(itemPathSelector, selectedPathSelector, (itemPath, selectedPath) => {
  const isSelected = itemPath.every((x, i) => selectedPath[i] == x);
  if (!isSelected) {
    return "unselected";
  }

  if (itemPath.length === selectedPath.length) {
    return "selected";
  }

  return "in-path";
})(cacheKeyGenerator);

const childPaths = createCachedSelector<
  AppState,
  SaveStructureItemProps,
  string[],
  SaveGame | null,
  string[][]
>(
  itemPathSelector,
  oniSaveSelector,
  (path, saveGame) => (saveGame ? getSaveItemChildPaths(path, saveGame) : [])
)(cacheKeyGenerator);

const mapStateToProps = function(
  state: AppState,
  props: SaveStructureItemProps
) {
  // Do not use createStructuredSelector here, as that itself
  //  creates a selector that will go nuts over our multi instance props.
  const stateProps = {
    title: title(state, props),
    selectionStatus: selectionStatus(state, props),
    childPaths: childPaths(state, props)
  };

  return stateProps;
};
export type StateProps = ReturnType<typeof mapStateToProps>;
export default mapStateToProps;