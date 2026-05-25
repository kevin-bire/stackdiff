/**
 * inlineEditState.ts
 * Manages state for inline editing of diff field values.
 */

export type EditStatus = 'idle' | 'editing' | 'saved' | 'cancelled';

export interface InlineEditState {
  status: EditStatus;
  serviceName: string | null;
  fieldPath: string | null;
  originalValue: string;
  currentValue: string;
  isDirty: boolean;
}

export function createInlineEditState(): InlineEditState {
  return {
    status: 'idle',
    serviceName: null,
    fieldPath: null,
    originalValue: '',
    currentValue: '',
    isDirty: false,
  };
}

export function beginEdit(
  state: InlineEditState,
  serviceName: string,
  fieldPath: string,
  originalValue: string
): InlineEditState {
  return {
    ...state,
    status: 'editing',
    serviceName,
    fieldPath,
    originalValue,
    currentValue: originalValue,
    isDirty: false,
  };
}

export function updateEditValue(
  state: InlineEditState,
  value: string
): InlineEditState {
  if (state.status !== 'editing') return state;
  return {
    ...state,
    currentValue: value,
    isDirty: value !== state.originalValue,
  };
}

export function commitEdit(state: InlineEditState): InlineEditState {
  if (state.status !== 'editing') return state;
  return {
    ...state,
    status: 'saved',
    isDirty: false,
  };
}

export function cancelEdit(state: InlineEditState): InlineEditState {
  if (state.status !== 'editing') return state;
  return {
    ...state,
    status: 'cancelled',
    currentValue: state.originalValue,
    isDirty: false,
  };
}

export function resetEdit(state: InlineEditState): InlineEditState {
  return createInlineEditState();
}

export function getEditSummary(state: InlineEditState): string {
  if (state.status === 'idle') return 'No active edit';
  if (state.status === 'editing')
    return `Editing ${state.serviceName}.${state.fieldPath}${
      state.isDirty ? ' (modified)' : ''
    }`;
  if (state.status === 'saved')
    return `Saved ${state.serviceName}.${state.fieldPath}`;
  return `Cancelled edit of ${state.serviceName}.${state.fieldPath}`;
}
