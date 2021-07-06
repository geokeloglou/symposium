export interface ModalData {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
}

export interface DialogPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

export interface CustomModalConfigData {
  width?: string;
  hasBackdrop?: boolean;
  position?: DialogPosition;
  panelClass?: string | string[];
  data?: ModalData;
}
