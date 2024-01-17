import { CSSProperties } from "react";

export interface ConfirmProps {

    open: boolean;
    object: any;
    onConfirm: (object: any) => void;
    onCancel: (object: any) => void;
    confirm: string;
    confirmStyle?: any;
    cancel: string;
    cancelStyle?: any;
    title: string;
    description: string;
}