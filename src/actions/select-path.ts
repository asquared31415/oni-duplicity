export const ACTION_SELECT_PATH = "@/pages/SaveEditor/select-path";
export const selectPath = (path: string[]) => ({
  type: ACTION_SELECT_PATH as typeof ACTION_SELECT_PATH,
  payload: path
});
export type SelectPathAction = ReturnType<typeof selectPath>;